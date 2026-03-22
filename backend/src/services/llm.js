const { ChatGoogleGenerativeAI } = require("@langchain/google-genai");

const MODELS = ["gemini-3-flash-preview"];

async function generateWithFallback(messages, temperature = 0.2) {
    const modelName = MODELS[0];

    console.log(`[LLM] Using model: ${modelName}`);
    const llm = new ChatGoogleGenerativeAI({
        model: modelName,
        temperature: temperature,
        maxOutputTokens: 8192,
        apiKey: process.env.GOOGLE_API_KEY
    });

    const result = await llm.invoke(messages);
    return result;
}

module.exports = { generateWithFallback };
