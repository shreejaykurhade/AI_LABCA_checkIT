require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { connectDB } = require('./src/db/mongo');
const { runAgent } = require('./src/graph');
const { resources } = require('./src/mcp/resources');

const app = express();
const port = process.env.PORT || 3000;
// Resources initialized in startServer

app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date() });
});

// History endpoint
app.get('/api/history', async (req, res) => {
    try {
        const history = await resources.history.list();
        res.json(history);
    } catch (error) {
        console.error("History fetch error:", error);
        res.status(500).json({ error: 'Failed to fetch history' });
    }
});

// Get Single Result endpoint
app.get('/api/history/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await resources.history.read(id);

        if (!result) {
            return res.status(404).json({ error: 'Result not found' });
        }
        res.json(result);
    } catch (error) {
        console.error("Single result fetch error:", error);
        res.status(500).json({ error: 'Failed to fetch result' });
    }
});

// Agent endpoint
app.post('/api/check', async (req, res) => {
    const { query } = req.body;

    if (!query) {
        return res.status(400).json({ error: 'Query is required' });
    }

    try {
        const result = await runAgent(query);

        // Save to DB
        await resources.history.create(query, result);

        // Extract relevant parts for the frontend
        const analysis = result.analysis_data;
        const grading = result.grading_data;

        // Check if gray area (40-60%) - escalate to DAO
        let daoCase = null;
        if (grading && grading.score >= 40 && grading.score <= 60) {
            const caseId = await resources.dao.escalate(query, analysis, grading.score);
            daoCase = {
                caseId: caseId.toString(),
                message: "This claim falls in a gray area. Community voting has been initiated.",
                votingDeadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
            };
        }

        res.json({
            analysis,
            grading,
            daoCase,
            full_state: result
        });
    } catch (error) {
        console.error("Agent execution error:", error);
        res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
});

// DAO Endpoints
app.get('/api/dao/pending', async (req, res) => {
    try {
        const cases = await resources.dao.listPending();
        res.json(cases);
    } catch (error) {
        console.error("DAO pending cases error:", error);
        res.status(500).json({ error: 'Failed to fetch pending cases' });
    }
});

app.get('/api/dao/case/:id', async (req, res) => {
    try {
        const { ObjectId } = require('mongodb');
        const caseData = await resources.dao.readCase(new ObjectId(req.params.id));
        if (!caseData) {
            return res.status(404).json({ error: 'Case not found' });
        }
        res.json(caseData);
    } catch (error) {
        console.error("DAO case fetch error:", error);
        res.status(500).json({ error: 'Failed to fetch case' });
    }
});

app.patch('/api/dao/case/:id', async (req, res) => {
    try {
        const { onChainId } = req.body;
        const { ObjectId } = require('mongodb');
        await resources.dao.updateOnChainId(new ObjectId(req.params.id), onChainId);
        res.json({ success: true });
    } catch (error) {
        console.error("DAO case update error:", error);
        res.status(500).json({ error: 'Failed to update case' });
    }
});

app.post('/api/dao/vote', async (req, res) => {
    try {
        const { caseId, voterAddress, vote, reasoning } = req.body;

        if (!caseId || !voterAddress || !vote) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const { ObjectId } = require('mongodb');
        await resources.dao.vote(new ObjectId(caseId), voterAddress, vote, reasoning);

        res.json({ success: true, message: 'Vote submitted successfully' });
    } catch (error) {
        console.error("DAO vote error:", error);
        res.status(500).json({ error: 'Failed to submit vote' });
    }
});

// Manual Escalation Endpoint
app.post('/api/dao/escalate', async (req, res) => {
    try {
        const { historyId } = req.body;
        const { runDeepAudit } = require('./src/graph');

        // Fetch history item
        const result = await resources.history.read(historyId);
        if (!result) {
            return res.status(404).json({ error: 'History item not found' });
        }

        // Check if already escalated
        if (result.isEscalated) {
            return res.status(400).json({ error: 'Case already escalated' });
        }

        // Trigger Deep Audit (Re-evaluation)
        console.log(`[Escalation] Running deep audit for: "${result.query}"...`);
        const auditResult = await runDeepAudit(result.query);
        const auditedAnalysis = auditResult.analysis_data || "Audit returned no data.";

        // Create DAO case with NEW Audited Analysis
        // We use the original score as a reference, or could re-grade. For now, referencing original score context.
        const caseId = await resources.dao.escalate(result.query, auditedAnalysis, result.grading?.score || 0);

        // Mark history as escalated
        await resources.history.markEscalated(historyId);

        res.json({ success: true, caseId: caseId });

    } catch (error) {
        console.error("Escalation error:", error);
        res.status(500).json({ error: 'Failed to escalate case' });
    }
});

async function startServer() {
    const db = await connectDB();
    await resources.init(db);
    app.listen(port, () => {
        console.log(`Server running at http://localhost:${port}`);
    });
}

startServer();
