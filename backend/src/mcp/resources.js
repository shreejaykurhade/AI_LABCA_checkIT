const { getHistory, getResultById, saveResult } = require("../services/store");
const { TruthDAO } = require("../services/dao");

// Singleton DAO instance (mirrors index.js usage)
const truthDAO = new TruthDAO();

const resources = {
    init: async (db) => {
        await truthDAO.initialize(db);
    },
    history: {
        list: async () => await getHistory(),
        read: async (id) => await getResultById(id),
        create: async (query, result) => await saveResult(query, result),
        markEscalated: async (id) => {
            const { markEscalated } = require("../services/store");
            return await markEscalated(id);
        }
    },
    dao: {
        listPending: async () => await truthDAO.getPendingCases(),
        readCase: async (id) => await truthDAO.getCase(id),
        escalate: async (query, analysis, score) => await truthDAO.escalateCase(query, analysis, score),
        vote: async (caseId, voter, vote, reasoning) => await truthDAO.submitVote(caseId, voter, vote, reasoning),
        updateOnChainId: async (id, onChainId) => await truthDAO.updateOnChainId(id, onChainId)
    }
};

module.exports = { resources, truthDAO };
