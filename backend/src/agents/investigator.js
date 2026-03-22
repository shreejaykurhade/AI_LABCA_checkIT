const { HumanMessage } = require("@langchain/core/messages");

const INDIAN_FACT_CHECK_DOMAINS = [
    "boomlive.in",
    "altnews.in",
    "factchecker.in",
    "newschecker.in",
    "vishvasnews.com",
    "pib.gov.in",
    "india.gov.in",
    "digitalindia.gov.in",
    "reuters.com",
    "thehindu.com",
    "indianexpress.com",
    "pti.in"
];

async function investigatorAgent(state) {
    const { messages } = state;
    const lastMessage = messages[messages.length - 1];
    const query = lastMessage.content;

    console.log(`[Investigator] Searching for: ${query}`);

    try {
        const response = await fetch("https://api.tavily.com/search", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                api_key: process.env.TAVILY_API_KEY,
                query: query,
                include_domains: INDIAN_FACT_CHECK_DOMAINS,
                max_results: 5,
                search_depth: "basic"
            })
        });

        if (!response.ok) {
            throw new Error(`Tavily API error: ${response.statusText}`);
        }

        const data = await response.json();
        // Serialize results
        const searchContext = JSON.stringify(data.results || []);

        return {
            messages: [new HumanMessage({ content: searchContext, name: "investigator_results" })],
            investigation_data: data.results
        };
    } catch (error) {
        console.error("[Investigator] Error:", error);
        return {
            messages: [new HumanMessage({ content: "Error performing search.", name: "investigator_error" })]
        }
    }
}

module.exports = { investigatorAgent };
