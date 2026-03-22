// API Configuration
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const API_ENDPOINTS = {
    HEALTH: `${API_URL}/health`,
    HISTORY: `${API_URL}/api/history`,
    HISTORY_BY_ID: (id) => `${API_URL}/api/history/${id}`,
    CHECK: `${API_URL}/api/check`,
    DAO_PENDING: `${API_URL}/api/dao/pending`,
    DAO_CASE: (id) => `${API_URL}/api/dao/case/${id}`,
    DAO_VOTE: `${API_URL}/api/dao/vote`,
    DAO_ESCALATE: `${API_URL}/api/dao/escalate`,
};

export default API_URL;
