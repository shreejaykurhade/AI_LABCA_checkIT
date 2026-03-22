import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { ThumbsUp, ThumbsDown } from 'lucide-react';
import { API_ENDPOINTS } from '../config/api';

const History = () => {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchHistory();
    }, []);

    const fetchHistory = async () => {
        try {
            const response = await axios.get(API_ENDPOINTS.HISTORY);
            setHistory(response.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container">
            <h2 style={{ marginBottom: '2rem' }}>// ARCHIVED CHECKS</h2>

            {loading ? (
                <p>LOADING ARCHIVES...</p>
            ) : (
                <div className="grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
                    {history.map((item) => {
                        const score = item.grading?.score || 0;
                        const getScoreColor = () => {
                            if (score >= 40 && score <= 60) return '#fbc531'; // Yellow for gray area
                            if (score >= 50) return 'green';
                            return 'red';
                        };

                        return (
                            <div key={item._id} className="brutal-box" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                                <div>
                                    <span className={`badge ${score >= 50 ? 'safe' : 'risk'}`} style={{
                                        fontWeight: 'bold',
                                        color: getScoreColor()
                                    }}>
                                        SCORE: {score || 'N/A'}
                                    </span>
                                    <p style={{ fontWeight: 'bold', marginTop: '1rem', fontSize: '1.2rem' }}>
                                        {item.query}
                                    </p>
                                    <p style={{ fontSize: '0.9rem', color: '#666' }}>
                                        {new Date(item.timestamp).toLocaleDateString()}
                                    </p>

                                    {/* Detailed Log Preview */}
                                    <div style={{ marginTop: '1rem', fontSize: '0.9rem', color: '#333', borderTop: '1px solid #ddd', paddingTop: '0.5rem' }}>
                                        {(() => {
                                            let content = item.analysis;

                                            // Helper to render structured data
                                            const renderStructured = (data) => (
                                                <div>
                                                    {data.summary && <p><strong>SUMMARY:</strong> {data.summary}</p>}
                                                    {data.conclusion && <p><strong>CONCLUSION:</strong> {data.conclusion}</p>}
                                                </div>
                                            );

                                            // Case 1: Already an object
                                            if (typeof content === 'object' && content !== null) {
                                                return renderStructured(content);
                                            }

                                            // Case 2: String that might be JSON
                                            if (typeof content === 'string') {
                                                if (content.trim().startsWith('{') || content.includes('"summary":')) {
                                                    try {
                                                        const json = JSON.parse(content);
                                                        return renderStructured(json);
                                                    } catch (e) {
                                                        // Fall through to text rendering
                                                    }
                                                }

                                                // Case 3: Regular text (Markdown cleanup)
                                                return content.split('### Sources')[0].split('\n').map((line, i) => {
                                                    const cleanLine = line.replace(/\*\*/g, '').replace(/\{/g, '').replace(/\}/g, '').replace(/#/g, '');
                                                    if (!cleanLine.trim()) return null;
                                                    return <div key={i}>{cleanLine}</div>;
                                                });
                                            }
                                            return null;
                                        })()}
                                    </div>

                                    {/* Vote Counts for Escalated Items */}
                                    {item.isEscalated && item.daoVotes && (
                                        <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem', fontSize: '0.8rem' }}>
                                            <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '0.3rem', background: '#4cd137', color: 'white', padding: '0.4rem', borderRadius: '3px', border: '2px solid black' }}>
                                                <ThumbsUp size={14} />
                                                <strong>{item.daoVotes.trueVotes || 0}</strong>
                                            </div>
                                            <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '0.3rem', background: '#e84118', color: 'white', padding: '0.4rem', borderRadius: '3px', border: '2px solid black' }}>
                                                <ThumbsDown size={14} />
                                                <strong>{item.daoVotes.falseVotes || 0}</strong>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '2px solid black', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                    <Link to={`/app/result/${item._id}`} style={{ textDecoration: 'none', color: 'black', fontWeight: 'bold' }}>
                                        VIEW FULL REPORT &rarr;
                                    </Link>

                                    {!item.isEscalated && (score < 40 || score > 60) && (
                                        <button
                                            className="brutal-btn"
                                            onClick={async (e) => {
                                                e.preventDefault();
                                                try {
                                                    if (!confirm('Escalate this case to the Truth DAO for voting?')) return;
                                                    await axios.post(API_ENDPOINTS.DAO_ESCALATE, { historyId: item._id });
                                                    alert('Case escalated to Truth DAO!');
                                                    fetchHistory(); // Refresh to hide button
                                                } catch (err) {
                                                    alert('Failed to escalate case.');
                                                }
                                            }}
                                            style={{ fontSize: '0.7rem', padding: '0.3rem 0.6rem', marginTop: '0.5rem', background: '#ffe6e6', color: 'red', border: '1px solid red', alignSelf: 'flex-start' }}
                                        >
                                            ⚖️ ESCALATE
                                        </button>
                                    )}
                                    {item.isEscalated && (
                                        <span style={{ fontSize: '0.7rem', color: '#e84118', fontWeight: 'bold', marginTop: '0.5rem' }}>
                                            ⚖️ ESCALATED
                                        </span>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default History;
