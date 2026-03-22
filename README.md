# CheckIT — Decode the Media Matrix
**Autonomous. Unbiased. Real-time.**

A full-stack, AI-powered fact-checking platform that combines a **Triple-Check Investigation System** with a decentralized-style **Truth DAO** to verify claims, combat misinformation, and grade news authenticity.

## 🌟 Features

### Frontend Features
- **Neo-Brutalist UI**: High-contrast, bold design system for a premium, assertive aesthetic.
- **Real-Time Analysis Stream**: Watch the AI agents (investigator, analyst, grader) work in real-time.
- **Truth DAO Voting Interface**: Community-driven governance for "Gray Area" claims (40-60% confidence).
- **Simulated Identity**: Anonymous, privacy-first user system (Web2-based anonymous ID) for instant voting capability.
- **Live Search Dashboard**: Dynamic results page showing source citations, Truth Scores, and evidence accumulation.

### Backend Features (MCP Architecture)
- **Model Context Protocol (MCP)**:
  - **Tools**: Standardized internal tools for Search (`Tavily`) and Search Filtering.
  - **Resources**: Unified data access for user History and DAO Cases.
  - **Prompts**: Centralized persona library for consistent Agent behavior.
- **Triple-Check Investigation**:
  - **Main Agent**: Direct claim verification.
  - **Skeptical Agent**: Actively searches for hoaxes, debunks, and counter-evidence.
  - **Context Agent**: Gathers historical background to prevent out-of-context misinformation.
- **Deep Audit System**: Automatic escalation to a rigorous "Internal Auditor" agent when results are ambiguous.
- **Tavily Integration**: Specialized "Indian Fact-Checkers" domain filter for high-relevance sourcing.

### AI Agents (LangGraph)
1.  **Investigator Node**: Parallel execution of 3 distinct search strategies.
2.  **Analyst Node**: Synthesizes thousands of words into a coherent "Conflict of Facts" report.
3.  **Grader Node**: Assigns a numeric **Truth Score (0-100)** based on evidence strength, not just sentiment.
4.  **Auditor Node**: A strict, skeptical reviewer that re-evaluates findings before DAO escalation.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: Vite + React.js (JavaScript)
- **Styling**: Vanilla CSS (Custom Design System) + Lucide Icons
- **State Management**: React Hooks + LocalStorage (for Anon ID)
- **Visuals**: CSS Animations, Glassmorphism effects

### Backend
- **Runtime**: Node.js 20+
- **Framework**: Express.js
- **Architecture**: **MCP (Model Context Protocol)** + LangGraph
- **Database**: MongoDB (Atlas/Local)
- **AI Models**: Google Gemini 1.5 Flash (via LangChain)
- **Search**: Tavily Search API

---

## 🏗️ Architecture

### System Diagram
```mermaid
graph TB
    subgraph "Client Layer"
        FE[Frontend<br/>React + Vite + Tailwind]
        USER((User))
    end

    subgraph "API Gateway"
        API[Express.js Server<br/>Port 3000]
    end

    subgraph "MCP Layer (Model Context Protocol)"
        TOOLS[Tools<br/>Search, Calculations]
        RESOURCES[Resources<br/>History, DAO Cases]
        PROMPTS[Prompts<br/>Personas: Analyst, Auditor]
    end

    subgraph "Agentic Core (LangGraph)"
        ORCH[Orchestrator<br/>StateGraph]
        
        subgraph "Investigation Phase"
            INV_MAIN[Investigator Agent<br/>Main Search]
            INV_SKEP[Parallel Agent<br/>Skeptical Search]
            INV_CTX[Parallel Agent<br/>Context Search]
        end
        
        ANALYST[Analyst Agent<br/>Fact Synthesizer]
        GRADER[Grader Agent<br/>Truth Scorer]
        
        subgraph "Audit Phase (DAO Escalation)"
            AUDITOR[Auditor Agent<br/>Deep Verification]
        end
    end

    subgraph "Data Layer"
        MONGO[(MongoDB<br/>dao_cases<br/>history)]
    end

    subgraph "External Services"
        GEMINI[Google Gemini 1.5-Flash<br/>Generative AI]
        TAVILY[Tavily API<br/>Deep Search]
    end

    %% Client Interactions
    USER -->|Interacts| FE
    FE -->|REST API| API
    
    %% API Routing
    API -->|Initialize Context| RESOURCES
    API -->|Run Workflow| ORCH
    
    %% MCP Wiring
    ORCH -->|Load System Prompts| PROMPTS
    INV_MAIN -->|Call Tool| TOOLS
    INV_SKEP -->|Call Tool| TOOLS
    INV_CTX -->|Call Tool| TOOLS
    
    %% Agent Logic
    ORCH -->|1. Parallel Search| INV_MAIN & INV_SKEP & INV_CTX
    INV_MAIN & INV_SKEP & INV_CTX -->|Aggregated Data| ANALYST
    ANALYST -->|Analysis| GRADER
    GRADER -->|"Score < 40 or > 60"| API
    GRADER -->|"Score 40-60 (Gray Area)"| AUDITOR
    AUDITOR -->|Escalation| RESOURCES
    
    %% External Calls
    TOOLS -->|Search Request| TAVILY
    ANALYST & GRADER & AUDITOR -->|Inference| GEMINI
    
    %% Persistence
    RESOURCES -->|Read/Write| MONGO
    API -->|Store Results| RESOURCES

    %% Styling
    style FE fill:#6366f1,stroke:#4f46e5,color:#fff
    style API fill:#10b981,stroke:#059669,color:#fff
    style ORCH fill:#f59e0b,stroke:#d97706,color:#fff
    style MONGO fill:#47a248,stroke:#2e7d32,color:#fff
    style GEMINI fill:#8b5cf6,stroke:#7c3aed,color:#fff
    style TAVILY fill:#ec4899,stroke:#db2777,color:#fff
    style TOOLS fill:#3b82f6,stroke:#1d4ed8,color:#fff
    style RESOURCES fill:#3b82f6,stroke:#1d4ed8,color:#fff
    style PROMPTS fill:#3b82f6,stroke:#1d4ed8,color:#fff
```

### High-Level Flow
1.  **User Inquiry** -> **MCP Tools** -> **Tavily Search** (Data Collection)
2.  **Raw Data** -> **Parallel Investigators** (Main/Skeptical/Context)
3.  **Findings** -> **Analyst Agent** (Synthesis)
4.  **Report** -> **Grader Agent** (Scoring)
5.  **Score Analysis**:
    - **0-39% / 61-100%**: Instant Verdict Returned.
    - **40-60% (Gray Area)** -> **Auditor Agent** -> **Truth DAO** (Community Vote).

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- MongoDB Database URI
- API Keys:
    - `GOOGLE_API_KEY` (Gemini)
    - `TAVILY_API_KEY` (Search)

### Backend Setup
```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Configure Environment
# Create .env and add:
# GOOGLE_API_KEY=...
# TAVILY_API_KEY=...
# MONGODB_URI=...

# Start Server
npm run start
# Runs on Port 3000
```

### Frontend Setup
```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Run Development Server
npm run dev
# Accessible at http://localhost:5173
```

---

## 🤖 The Truth DAO
The **Truth DAO** is CheckIT's solution for the "Subjective Gap" — cases where AI cannot definitively determine truth.

1.  **Auto-Escalation**: System identifies ambiguous claims.
2.  **Auditor Review**: An AI Auditor performs a "Deep Audit" to prepare a neutral briefing.
3.  **Public Voting**: Users pledge their "Stake" (Simulated) to vote True/False.
4.  **Consensus**: Majority vote settles the claim and resolves the case.

---

## 📂 Project Structure
```
checkit/
├── backend/
│   ├── src/
│   │   ├── agents/         # LangGraph Agent Definitions
│   │   ├── mcp/            # MCP Core (Tools, Resources, Prompts)
│   │   ├── services/       # Store, DAO Service
│   │   └── graph.js        # Workflow Orchestration
│   └── index.js            # Entry Point
├── frontend/
│   ├── src/
│   │   ├── pages/          # UI Views (Landing, Result, DAO)
│   │   └── components/     # Reusable UI widgets
│   └── package.json
└── README.md
```
