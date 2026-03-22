const { HumanMessage } = require("@langchain/core/messages");
const { saveResult, getHistory, getResultById } = require("../services/store");
const { TruthDAO } = require("../services/dao");

const INDIAN_FACT_CHECK_DOMAINS = [
    "boomlive.in",
    "altnews.in",
    "factchecker.in",
    "newschecker.in",
    "vishvasnews.com",
    "pib.gov.in",
    "newsmobile.in",
    "thequint.com",
    "indiatoday.in",
    "timesofindia.indiatimes.com",
    "hindustantimes.com",
    "indianexpress.com",
    "thehindu.com",
    "ndtv.com",
    "airnewsalerts.com",
    "ddnews.gov.in"
];

// TOOL: Search Indian Fact Checkers
// Input: query (string)
// Output: Array of search results or error object
async function searchIndianFactCheckers(query) {
    console.log(`[Tool:searchIndianFactCheckers] Searching for: ${query}`);

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
                topic: "general",
                max_results: 6,
                search_depth: "advanced"
            })
        });

        if (!response.ok) {
            if (response.status === 429) {
                return { error: "RATE_LIMIT_EXCEEDED", retryable: true };
            }
            return { error: `API Error: ${response.statusText}` };
        }

        const data = await response.json();

        if (!data.results || data.results.length === 0) {
            return { results: [], message: "No results found." };
        }

        // Relevance Filtering
        const commonWords = ['january', '2026', 'news', 'latest', 'today', 'report', 'india'];
        const queryKeywords = query.toLowerCase()
            .split(' ')
            .filter(word => word.length > 2 && !commonWords.includes(word));

        const relevantResults = data.results.filter(result => {
            const snippet = (result.content || result.snippet || '').toLowerCase();
            const matchedKeywords = queryKeywords.filter(keyword => snippet.includes(keyword));
            const matchRatio = matchedKeywords.length / (queryKeywords.length || 1); // Avoid div by zero

            if (matchRatio < 0.6) {
                return false;
            }
            return true;
        });

        return { results: relevantResults, totalFound: data.results.length };

    } catch (error) {
        console.error("[Tool:searchIndianFactCheckers] Error:", error);
        return { error: error.message };
    }
}

// TOOL: Generic Search (for "Skeptical" or "Context" checks)
async function searchGeneric(query, options = {}) {
    console.log(`[Tool:searchGeneric] Searching for: ${query}`);
    try {
        const response = await fetch("https://api.tavily.com/search", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                api_key: process.env.TAVILY_API_KEY,
                query: query,
                topic: "general",
                max_results: options.max_results || 5,
                search_depth: "advanced"
            })
        });

        if (!response.ok) return { error: `API Error: ${response.status}`, results: [] };

        const data = await response.json();
        return { results: data.results || [] };
    } catch (e) {
        return { error: e.message, results: [] };
    }
}

const tools = {
    searchIndianFactCheckers,
    searchGeneric
};

module.exports = tools;
