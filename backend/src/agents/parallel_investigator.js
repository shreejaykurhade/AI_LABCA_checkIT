const { HumanMessage } = require("@langchain/core/messages");
const { searchGeneric } = require("../mcp/tools");

async function parallelInvestigatorAgent(state) {
    const messages = state.messages;
    const originalQuery = messages[messages.length - 1].content;

    console.log(`[ParallelInvestigator] Starting triple-check for: "${originalQuery}"`);

    // 1. Direct Verification
    // We use searchGeneric here for parallelism, but we could also use searchIndianFactCheckers for the main one.
    // For consistency with the "Parallel" concept, let's use the generic search but labelled.
    const p1 = searchGeneric(originalQuery, { max_results: 5 }).then(res => ({ type: "Main Investigation", ...res }));

    // 2. Skeptical/Variant Check
    const p2 = searchGeneric(`${originalQuery} hoax fake facts`, { max_results: 5 }).then(res => ({ type: "Skeptical Check", ...res }));

    // 3. Background/Context Check
    const p3 = searchGeneric(`${originalQuery} background history details`, { max_results: 5 }).then(res => ({ type: "Context Check", ...res }));

    const results = await Promise.all([p1, p2, p3]);

    // Aggregate findings
    const aggregatedData = {
        original_query: originalQuery,
        timestamp: new Date(),
        investigations: results
    };

    return {
        investigation_data: aggregatedData
    };
}

module.exports = { parallelInvestigatorAgent };
