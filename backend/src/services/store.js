const { getDB } = require('../db/mongo');

const COLLECTION_HISTORY = 'history';
const memoryStore = []; // Fallback storage

async function saveResult(query, result) {
    const db = getDB();
    const entry = {
        query,
        analysis: result.analysis_data,
        grading: result.grading_data,
        full_state: result,
        timestamp: new Date(),
        isEscalated: false // valid default
    };

    if (db) {
        await db.collection(COLLECTION_HISTORY).insertOne(entry);
    } else {
        entry._id = Date.now().toString(); // Mock ID for memory only
        memoryStore.unshift(entry);
        if (memoryStore.length > 50) memoryStore.pop();
    }
    return entry;
}

async function getHistory() {
    const db = getDB();
    if (db) {
        const history = await db.collection(COLLECTION_HISTORY)
            .find({})
            .sort({ timestamp: -1 })
            .limit(20)
            .toArray();

        // For each escalated item, fetch its DAO case votes
        for (let item of history) {
            if (item.isEscalated) {
                try {
                    // Find the DAO case that matches this query
                    const daoCase = await db.collection('dao_cases').findOne({ query: item.query });
                    if (daoCase && daoCase.votes) {
                        const trueVotes = daoCase.votes.filter(v => v.vote === 'true').length;
                        const falseVotes = daoCase.votes.filter(v => v.vote === 'false').length;
                        item.daoVotes = { trueVotes, falseVotes };
                    }
                } catch (e) {
                    console.error('Error fetching DAO votes for history item:', e);
                }
            }
        }

        return history;
    }
    return memoryStore;
}

async function getResultById(id) {
    const db = getDB();
    if (db) {
        const { ObjectId } = require('mongodb');
        try {
            // Robust lookup: Try ObjectId first, then string
            let result = await db.collection(COLLECTION_HISTORY).findOne({ _id: new ObjectId(id) });
            if (!result) {
                // Determine if it might be stored as a string ID (legacy/mock data)
                result = await db.collection(COLLECTION_HISTORY).findOne({ _id: id });
            }
            return result;
        } catch (e) {
            // If ObjectId fails (invalid format), try string lookup directly
            try {
                return await db.collection(COLLECTION_HISTORY).findOne({ _id: id });
            } catch (err) { return null; }
        }
    }
    return memoryStore.find(item => item._id === id) || null;
}

async function markEscalated(id) {
    const db = getDB();
    if (db) {
        const { ObjectId } = require('mongodb');
        try {
            await db.collection(COLLECTION_HISTORY).updateOne(
                { _id: new ObjectId(id) },
                { $set: { isEscalated: true } }
            );
            return true;
        } catch (e) { return false; }
    }
    const item = memoryStore.find(item => item._id === id);
    if (item) item.isEscalated = true;
    return !!item;
}

module.exports = { saveResult, getHistory, getResultById, markEscalated };
