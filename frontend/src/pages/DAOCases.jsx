import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Clock, Users, ChevronDown, ChevronUp, Scale } from 'lucide-react';
import { API_ENDPOINTS } from '../config/api';

const DAOCases = () => {
    const [cases, setCases] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedCase, setExpandedCase] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchPendingCases();
    }, []);

    const fetchPendingCases = async () => {
        try {
            const response = await axios.get(API_ENDPOINTS.DAO_PENDING);
            setCases(response.data);
        } catch (error) {
            console.error('Error fetching cases:', error);
        } finally {
            setLoading(false);
        }
    };

    const toggleCase = (caseId) => {
        setExpandedCase(expandedCase === caseId ? null : caseId);
    };

    if (loading) {
        return <div className="container"><h2>Loading pending cases...</h2></div>;
    }

    return (
        <div className="container">
            <div className="brutal-box" style={{ background: 'var(--highlight-color)', marginBottom: '2rem' }}>
                <h1 style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <Scale size={36} /> TRUTH DAO - PENDING CASES
                </h1>
                <p style={{ fontSize: '1.2rem', marginTop: '1rem' }}>
                    Community-driven fact-checking for gray area claims. Vote to earn rewards!
                </p>
            </div>

            {cases.length === 0 ? (
                <div className="brutal-box" style={{ textAlign: 'center', padding: '3rem' }}>
                    <h2>No pending cases</h2>
                    <p style={{ marginTop: '1rem', fontSize: '1.1rem' }}>
                        All claims have clear verdicts. Check back later for gray area cases!
                    </p>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {cases.map((caseData) => {
                        const trueVotes = caseData.votes?.filter(v => v.vote === 'true').length || 0;
                        const falseVotes = caseData.votes?.filter(v => v.vote === 'false').length || 0;
                        const totalVotes = caseData.votes?.length || 0;
                        const isExpanded = expandedCase === caseData._id;

                        return (
                            <div
                                key={caseData._id}
                                style={{
                                    border: '5px solid black',
                                    background: 'white',
                                    transition: 'all 0.3s ease'
                                }}
                            >
                                {/* Collapsed Header - Always Visible */}
                                <div
                                    onClick={() => toggleCase(caseData._id)}
                                    style={{
                                        padding: '1.5rem',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        background: isExpanded ? 'var(--highlight-color)' : 'white',
                                        borderBottom: isExpanded ? '5px solid black' : 'none',
                                        transition: 'background 0.3s'
                                    }}
                                >
                                    <div style={{ flex: 1 }}>
                                        <h3 style={{ margin: 0, fontSize: '1.3rem' }}>{caseData.query}</h3>
                                        <div style={{ display: 'flex', gap: '2rem', marginTop: '0.5rem', fontSize: '0.9rem', flexWrap: 'wrap' }}>
                                            <span><strong>AI Score:</strong> {caseData.initialScore}/100</span>
                                            <span>
                                                <Users size={14} style={{ display: 'inline', marginRight: '0.3rem' }} />
                                                <strong>{totalVotes}</strong> votes
                                            </span>
                                            <span>
                                                <Clock size={14} style={{ display: 'inline', marginRight: '0.3rem' }} />
                                                {new Date(caseData.votingDeadline).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>
                                    <div style={{ fontSize: '2rem', marginLeft: '1rem' }}>
                                        {isExpanded ? <ChevronUp size={32} /> : <ChevronDown size={32} />}
                                    </div>
                                </div>

                                {/* Expanded Content */}
                                {isExpanded && (
                                    <div style={{
                                        padding: '2rem',
                                        animation: 'slideDown 0.3s ease-out'
                                    }}>
                                        {/* Vote Stats */}
                                        <div style={{
                                            display: 'flex',
                                            gap: '1rem',
                                            marginBottom: '2rem',
                                            padding: '1.5rem',
                                            background: '#f9f9f9',
                                            border: '3px solid black'
                                        }}>
                                            <div style={{ flex: 1, textAlign: 'center', padding: '1rem', background: '#4cd137', border: '3px solid black' }}>
                                                <div style={{ fontSize: '3rem', fontWeight: 'bold', color: 'white' }}>{trueVotes}</div>
                                                <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'white' }}>TRUE</div>
                                            </div>
                                            <div style={{ flex: 1, textAlign: 'center', padding: '1rem', background: '#e84118', border: '3px solid black' }}>
                                                <div style={{ fontSize: '3rem', fontWeight: 'bold', color: 'white' }}>{falseVotes}</div>
                                                <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'white' }}>FALSE</div>
                                            </div>
                                        </div>

                                        {/* AI Analysis Preview */}
                                        <div style={{ marginBottom: '1.5rem' }}>
                                            <h4 style={{ marginTop: 0, fontSize: '1.1rem' }}>AI ANALYSIS PREVIEW:</h4>
                                            <div style={{
                                                background: '#f0f0f0',
                                                padding: '1rem',
                                                border: '2px solid black',
                                                fontSize: '0.95rem',
                                                maxHeight: '150px',
                                                overflow: 'hidden',
                                                position: 'relative'
                                            }}>
                                                {(() => {
                                                    let content = caseData.analysis;
                                                    let previewText = "";

                                                    if (typeof content === 'object' && content !== null) {
                                                        previewText = content.summary || JSON.stringify(content);
                                                    } else if (typeof content === 'string') {
                                                        if (content.trim().startsWith('{') || content.includes('"summary":')) {
                                                            try {
                                                                const json = JSON.parse(content);
                                                                previewText = json.summary || json.conclusion || content;
                                                            } catch (e) {
                                                                previewText = content;
                                                            }
                                                        } else {
                                                            previewText = content.split('### Sources')[0].replace(/\*\*/g, '').replace(/\{/g, '').replace(/\}/g, '');
                                                        }
                                                    }

                                                    return previewText.substring(0, 300) + "...";
                                                })()}

                                                <div style={{
                                                    position: 'absolute',
                                                    bottom: 0,
                                                    left: 0,
                                                    right: 0,
                                                    height: '50px',
                                                    background: 'linear-gradient(transparent, #f0f0f0)'
                                                }} />
                                            </div>
                                        </div>

                                        {/* Vote Button */}
                                        <button
                                            className="brutal-btn"
                                            style={{ width: '100%', background: 'black', color: 'white', fontSize: '1.2rem', padding: '1rem' }}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                navigate(`/app/dao/${caseData._id}`);
                                            }}
                                        >
                                            VIEW FULL CASE & VOTE →
                                        </button>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}

            <style>{`
                @keyframes slideDown {
                    from {
                        opacity: 0;
                        max-height: 0;
                    }
                    to {
                        opacity: 1;
                        max-height: 1000px;
                    }
                }
            `}</style>
        </div>
    );
};

export default DAOCases;
