const { HumanMessage } = require("@langchain/core/messages");
const { searchIndianFactCheckers } = require("../mcp/tools");

async function investigatorAgent(state) {
    const { messages } = state;
    const lastMessage = messages[messages.length - 1];
    const query = lastMessage.content;

    console.log(`[Investigator] Searching for: ${query}`);

    try {
        // Use MCP Tool
        const result = await searchIndianFactCheckers(query);

        if (result.error) {
            if (result.retryable) {
                return {
                    messages: [new HumanMessage({
                        content: JSON.stringify({
                            error: "SERVICE_BUSY",
                            message: "Our search specialists are currently busy. Please try again in a moment.",
                            isRetryable: true
                        }),
                        name: "investigator_error"
                    })]
                };
            }
            throw new Error(result.error);
        }

        if (result.results.length === 0) {
            return {
                messages: [new HumanMessage({
                    content: JSON.stringify({
                        error: "NO_RESULTS",
                        message: result.message || "No relevant sources found for this query in trusted Indian databases."
                    }),
                    name: "investigator"
                })]
            };
        }

        console.log(`[Investigator] Found ${result.results.length} relevant results.`);

        return {
            messages: [new HumanMessage({ content: JSON.stringify(result.results), name: "investigator" })]
        };

    } catch (error) {
        console.error("[Investigator] Error:", error);
        return {
            messages: [new HumanMessage({ content: "Error performing search.", name: "investigator_error" })]
        }
    }
}

module.exports = { investigatorAgent };
