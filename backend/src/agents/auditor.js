const { HumanMessage } = require("@langchain/core/messages");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const { AUDITOR_PROMPT } = require("../mcp/prompts");

async function auditorAgent(state) {
    const { investigation_data } = state;
    // We assume 'investigation_data' contains the raw search results from the previous step (Investigator)

    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // The auditor has a strict persona
    const prompt = `
        ${AUDITOR_PROMPT}

        ## INPUT DATA (3 Parallel Investigations):
        ${JSON.stringify(investigation_data)}
    `;

    try {
        console.log("[Auditor] Auditing investigation data...");
        const result = await model.generateContent(prompt);
        const response = result.response;
        const text = response.text();

        // Ensure JSON parsing
        let cleanedText = text.replace(/```json/g, '').replace(/```/g, '').trim();
        let jsonResponse;
        try {
            jsonResponse = JSON.parse(cleanedText);
        } catch (e) {
            // Fallback for text
            jsonResponse = {
                summary: cleanedText,
                evidence: [],
                conflicts: [],
                conclusion: "Audit completed (Raw Text due to formatting error).",
                audit_note: "Manual review recommended."
            };
        }

        // Return strictly formatted string for consistency with existing UI parsing
        return {
            analysis_data: JSON.stringify(jsonResponse)
        };

    } catch (error) {
        console.error("[Auditor] Error:", error);
        return {
            analysis_data: JSON.stringify({
                summary: "Audit failed due to technical error.",
                conclusion: "INCONCLUSIVE",
                audit_note: "System error during audit."
            })
        };
    }
}

module.exports = { auditorAgent };
