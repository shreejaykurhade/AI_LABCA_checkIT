const { StateGraph, END } = require("@langchain/langgraph");
const { investigatorAgent } = require("./agents/investigator_v2");
const { analystAgent } = require("./agents/analyst");
const { graderAgent } = require("./agents/grader");

// Define the state channels
// We are using a simple message list state for now, but in a real app 
// we would define a more structured schema with channels.
const graphState = {
    messages: {
        value: (x, y) => x.concat(y),
        default: () => [],
    },
    investigation_data: {
        value: (x, y) => y, // distinct replacement
        default: () => ({})
    },
    analysis_data: {
        value: (x, y) => y,
        default: () => ""
    },
    grading_data: {
        value: (x, y) => y,
        default: () => ({})
    },
};

const workflow = new StateGraph({
    channels: graphState
});

// Add nodes
workflow.addNode("investigator", investigatorAgent);
workflow.addNode("analyst", analystAgent);
workflow.addNode("grader", graderAgent);

// Set entry point
workflow.setEntryPoint("investigator");

// Add edges
workflow.addEdge("investigator", "analyst");
workflow.addEdge("analyst", "grader");
workflow.addEdge("grader", END);

// Compile the graph
const app = workflow.compile();

async function runAgent(query) {
    const inputs = {
        messages: [{ content: query, name: "user" }]
    };

    // simple turn-by-turn execution
    const result = await app.invoke(inputs);
    return result;
}

// Auditor workflow (Separate graph for clarity)
const auditorWorkflow = new StateGraph({
    channels: graphState
});

const { auditorAgent } = require("./agents/auditor");
const { parallelInvestigatorAgent } = require("./agents/parallel_investigator");

// Use parallel investigator for deep audit
auditorWorkflow.addNode("investigator", parallelInvestigatorAgent);
auditorWorkflow.addNode("auditor", auditorAgent);

auditorWorkflow.addEdge("investigator", "auditor");
auditorWorkflow.setEntryPoint("investigator");
auditorWorkflow.addEdge("auditor", END);

const auditorApp = auditorWorkflow.compile();

async function runDeepAudit(query) {
    const inputs = {
        messages: [{ content: query, name: "user" }]
    };
    const result = await auditorApp.invoke(inputs);
    return result;
}

module.exports = { runAgent, runDeepAudit };
