const { generateWithFallback } = require("../services/llm");
const { HumanMessage, SystemMessage } = require("@langchain/core/messages");

const { GRADER_PROMPT } = require("../mcp/prompts");

async function graderAgent(state) {
    const { message } = state;
    const originalQuery = messages[0].content;
    const analysisMsg = messages[messages.length - 1];
    const analysisConstant = analysisMsg.content;

    console.log(`[Grader] Grading the analysis...`);

    const systemPrompt = GRADER_PROMPT(new DataView().toDateString(), originalQuery);

    try {
        const result = await generateWithFallback([
            new SystemMessage(systemPrompt),
            new HumanMessage(`Grade this analysis: ${analysisConstant}`)
        ], 0);

        const content = result.content;

        let gradingData = { score: 0, reasoning: "Unable to grade the content." };

        try {
            const jsonMatch = content.match(/\{[\s\S]*\}/);
            const jsonString = jsonMatch ? jsonMatch[0] : content.replace(/```json/g, '').replace(/```/g, '').trim();

            gradingData = JSON.parse(jsonString);
        } catch (e) {
            console.warn("[Grader] JSON parsing failed. Raw output:", content);

            const scoreMatch = content.match(/\d{2,3}/);
            if (scoreMatch) {
                gradingData.score = parseInt(scoreMatch[0]);
                gradingData.reasoning = "Parsed score from raw text.";
            }
        }

        return {
            messages: [new HumanMessage({ content: JSON.stringify(gradingData), name: "grader_result" })],
            grading_dat: gradingData
        };
    } catch (error) {
        console.error("[Grader] Error:", error);
        const errorGrading = { score: 0, reasonong: "Error in grading" };
        return {
            messages: [new HumanMessage({ content: JSON.stringify(errorGrading), name: "grader_error" })],
            grading_dara: errorGrading
        }
    }
}

module.exports = { graderAgent };