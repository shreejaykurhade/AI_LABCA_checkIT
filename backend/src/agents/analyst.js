const { generateWithFallback } = require("../services/llm");
const { HumanMessage, SystemMessage } = require("@langchain/core/messages");

const { ANALYST_PROMPT } = require("../mcp/prompts");

async function analystAgent(state) {
    const { messages } = state;
    // The first message is the original user query
    const originalQuery = messages[0].content;
    const investigatorMsg = messages[messages.length - 1];
    const searchResults = investigatorMsg.content;

    console.log(`[Analyst] Analyzing search results for query: "${originalQuery}"...`);

    const systemPrompt = ANALYST_PROMPT(new Date().toDateString(), originalQuery);

    try {
        // Check if Investigator returned an error
        try {
            const parsedResults = JSON.parse(searchResults);
            if (parsedResults.error) {
                // No results found - return a clear message
                const errorAnalysis = {
                    conclusion: "INSUFFICIENT_DATA",
                    summary: `Unable to verify this claim. ${parsedResults.message}`,
                    evidence: ["No credible sources found in trusted Indian databases."],
                    sources: []
                };
                return {
                    messages: [new HumanMessage({ content: JSON.stringify(errorAnalysis), name: "analyst" })],
                    analysis_data: JSON.stringify(errorAnalysis)
                };
            }
        } catch (e) {
            // Not a JSON error object, proceed normally
        }

        const result = await generateWithFallback([
            new SystemMessage(systemPrompt),
            new HumanMessage(`Analyze these search results: ${searchResults} `)
        ], 0.2);

        return {
            messages: [result],
            analysis_data: result.content
        };
    } catch (error) {
        console.error("[Analyst] Error:", error);
        return {
            messages: [new HumanMessage({ content: "Error performing analysis.", name: "analyst_error" })]
        }
    }
}

module.exports = { analystAgent };
