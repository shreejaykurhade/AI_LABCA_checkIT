import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { API_ENDPOINTS } from '../config/api';
import { ArrowLeft, Loader } from 'lucide-react';

const Result = () => {
    const { id } = useParams();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchResult();
    }, [id]);

    const fetchResult = async () => {
        try {
            const response = await axios.get(API_ENDPOINTS.HISTORY_BY_ID(id));
            setData(response.data);
        } catch (err) {
            console.error(err);
            setError('Could not retrieve report data.');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return (
        <div className="container" style={{ textAlign: 'center', marginTop: '4rem' }}>
            <Loader className="spin" size={48} />
            <p>DECRYPTING ARCHIVES...</p>
        </div>
    );

    if (error) return (
        <div className="container">
            <div className="brutal-box" style={{ borderColor: 'red' }}>
                <h2 style={{ color: 'red' }}>ERROR 404</h2>
                <p>{error}</p>
                <Link to="/app/history" className="brutal-btn" style={{ display: 'inline-block', marginTop: '1rem', textDecoration: 'none' }}>
                    <ArrowLeft size={16} /> BACK TO ARCHIVES
                </Link>
            </div>
        </div>
    );

    return (
        <div className="container">
            <Link to="/app/history" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem', color: 'black', textDecoration: 'none', fontWeight: 'bold' }}>
                <ArrowLeft size={20} /> RETURN TO ARCHIVES
            </Link>

            <div className="brutal-box" style={{ marginBottom: '2rem' }}>
                <h3>// QUERY SUBMISSION</h3>
                <p style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>"{data.query}"</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
                    <p style={{ fontSize: '0.9rem', color: '#666' }}>
                        TIMESTAMP: {new Date(data.timestamp).toLocaleString()}
                    </p>

                    {!data.isEscalated && (data.grading?.score < 40 || data.grading?.score > 60) && (
                        <button
                            className="brutal-btn"
                            onClick={async (e) => {
                                e.preventDefault();
                                try {
                                    if (!confirm('Escalate this case to the Truth DAO for voting?')) return;
                                    await axios.post(API_ENDPOINTS.DAO_ESCALATE, { historyId: data._id });
                                    alert('Case escalated to Truth DAO!');
                                    fetchResult(); // Refresh
                                } catch (err) {
                                    alert('Failed to escalate case.');
                                }
                            }}
                            style={{ fontSize: '0.7rem', padding: '0.3rem 0.6rem', background: '#ffe6e6', color: 'red', border: '1px solid red', cursor: 'pointer' }}
                        >
                            ⚖️ ESCALATE
                        </button>
                    )}
                    {data.isEscalated && (
                        <span style={{ fontSize: '0.8rem', color: '#e84118', fontWeight: 'bold' }}>
                            ⚖️ ESCALATED
                        </span>
                    )}
                </div>
            </div>

            {data.grading && (
                <div className={`score-card ${getScoreClass(data.grading.score)}`}>
                    <h1 style={{ fontSize: '6rem', margin: 0 }}>{data.grading.score}</h1>
                    <h3>TRUST SCORE</h3>
                    <p style={{ fontStyle: 'italic', fontSize: '1.2rem' }}>"{data.grading.reasoning}"</p>
                </div>
            )}

            <div className="analysis-box brutal-box">
                <h3>// DETAILED INVESTIGATION LOG</h3>
                <div className="markdown-content" style={{ textAlign: 'left', marginTop: '1rem', lineHeight: '1.8' }}>
                    {(() => {
                        let content = data.analysis;

                        // Helper to render structured data
                        const renderStructured = (data) => (
                            <div>
                                {data.summary && (
                                    <>
                                        <h4 style={{ fontSize: '1.1rem', fontWeight: 'bold', marginTop: '1rem', textTransform: 'uppercase' }}>SUMMARY</h4>
                                        <p>{data.summary}</p>
                                    </>
                                )}
                                {data.evidence && data.evidence.length > 0 && (
                                    <>
                                        <h4 style={{ fontSize: '1.1rem', fontWeight: 'bold', marginTop: '1.5rem', textTransform: 'uppercase' }}>EVIDENCE</h4>
                                        <ul style={{ paddingLeft: '1.5rem', marginTop: '0.5rem' }}>
                                            {data.evidence.map((ev, k) => <li key={k}>{ev}</li>)}
                                        </ul>
                                    </>
                                )}
                                {data.conclusion && (
                                    <>
                                        <h4 style={{ fontSize: '1.1rem', fontWeight: 'bold', marginTop: '1.5rem', textTransform: 'uppercase' }}>CONCLUSION</h4>
                                        <p>{data.conclusion}</p>
                                    </>
                                )}
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
                                if (line.trim().startsWith('SUMMARY') || line.trim().startsWith('CONCLUSION')) {
                                    return (
                                        <h4 key={i} style={{
                                            fontSize: '1.1rem',
                                            fontWeight: 'bold',
                                            marginTop: '1.5rem',
                                            marginBottom: '0.5rem',
                                            color: 'black',
                                            textTransform: 'uppercase'
                                        }}>
                                            {cleanLine.trim()}
                                        </h4>
                                    );
                                }
                                return <div key={i}>{cleanLine}</div>;
                            });
                        }
                        return null;
                    })()}

                    {/* Sources Section - Logic moved out of the main block to handle separately if needed, 
                        but for consistency with Home.jsx, we can check for sources string split */}
                    {typeof data.analysis === 'string' && data.analysis.includes('### Sources') && (
                        <div className="brutal-box" style={{ marginTop: '2rem', borderLeft: '10px solid var(--secondary-color)' }}>
                            <h3>// SOURCES & REFERENCES</h3>
                            <div style={{ textAlign: 'left' }}>
                                {data.analysis.split('### Sources')[1]?.split('\n')
                                    .filter(line => line.trim())
                                    .map((line, idx) => {
                                        const match = line.match(/(\d+)\.\s*\[([^\]]+)\]\(([^)]+)\)/);
                                        if (match) {
                                            const [, num, title, url] = match;
                                            return (
                                                <div key={idx} style={{ marginBottom: '1rem', padding: '0.5rem', background: '#f9f9f9', border: '2px solid black' }}>
                                                    <strong>[{num}]</strong>{' '}
                                                    <a href={url} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--secondary-color)', textDecoration: 'underline', fontWeight: 'bold' }}>
                                                        {title}
                                                    </a>
                                                    <br />
                                                    <span style={{ fontSize: '0.85rem', color: '#555', wordBreak: 'break-all' }}>{url}</span>
                                                </div>
                                            );
                                        }
                                        return null;
                                    })}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

function getScoreClass(score) {
    if (score >= 80) return 'score-high';
    if (score >= 50) return 'score-medium';
    return 'score-low';
}

export default Result;
