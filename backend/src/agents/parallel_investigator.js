const { HumanMessage} = require("@langchain/core/messages");
const {searchGeneric} = require("../mcp/tools");

async function parallelInvestigatorAgent(state){
    const messages = state.messages;
    const originalQuery = messages[messages.length -1].content;

    console.log('[Parallel Investigator] Starting triple check for : "${originalQuery}"...');
    
    const p1=searchGeneric(originalQuery,{ max_results: 5}).then(res=>({ type:" Main Investigation"}));
    const p2=searchGeneric(`${originalQuery} hoax fake facts`, { max_results: 5}).then(res=>({ type:" Skeptical Check", ...res}));
    const p3=searchGeneric(`${originalQuery} background history`,{max_results: 5}).then(res=>({ type:" Contextual Check", ...res}));
    const results = await Promise.all([p1,p2,p3]);

    const aggregatedData={
        original_query: originalQuery,
        timestamp: new Date(),
        investigations: results
    };

    return{
        investigation_data: aggregatedData
    };
    }
    module.exports = {
        parallelInvestigatorAgent
    };
