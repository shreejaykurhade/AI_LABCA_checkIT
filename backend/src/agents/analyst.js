const {generateWithFallback} = require("../services/llm");
const{HumanMessage,SystemMessage} = require("@langchain/core/messages");
const {AnalystAgent} = require("../mcp/prompts");

async function analystAgent(state){
const { messages }=state;
const originalQuery = messages[0].content;
const investigatorMsg = messages[messages.length -1];
const searchResults = investigatorMsg.content;

console.log(`[Analyst] Analysing search results for query: "${originalQuery}"...`);
const systemPrompt = ANALYST_PROMPT(new Date().toDateString(), originalQuery);
try{
    try{
        const parsedResults = JSON.parse(searchResults);
        if(parsedResults.error){
            const errorAnalysis={
                conclusion: " Insufficient data",
                summary: 'unable to verify this claim. ${parsedResults.error}',
                evidence:["No credible sources found in trusted Indian dbs"],
                sources:[]

            };
            return{
                messages:[new HumanMessage({content:JSON.stringify(errorAnalysis), name:'Analyst'})],
                analysis_data: JSON.stringify(errorAnalysis)

            };
    }
} catch (e){

}
const result= await generateWithFallback([
    new SystemMessage({content: systemPrompt}),
    new HumanMessage('analyse these searches results: ${searchResults}')].slice(0,2));

return{
    messages:[result],
    analysis_data: result.content
};
} catch (error){
    console.error("[Analyst] Error during analysis:", error);
    return{
        messages:[new HumanMessage({content: "Error during analysis. Please try again later.", name:'analyst_error'})]
    }
}
}

module.exports = {
    analystAgent
};