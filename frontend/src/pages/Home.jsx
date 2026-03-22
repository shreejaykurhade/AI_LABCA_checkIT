import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, TrendingUp, AlertTriangle, CheckCircle, Loader, Plus, FileText, ChevronRight, Lightbulb, Clock, Scale } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { API_ENDPOINTS } from '../config/api';

const Home = () => {
    const [query, setQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);
    const [recentChecks, setRecentChecks] = useState([]); // Changed from recentSearches
    const navigate = useNavigate();

    useEffect(() => {
        fetchRecentChecks(); // Changed from fetchRecentSearches
    }, []);

    const fetchRecentChecks = async () => { // Changed function name
        try {
            const response = await axios.get(API_ENDPOINTS.HISTORY);
            setRecentChecks(response.data.slice(0, 5)); // Latest 5last 5 // Changed state variable and comment
        } catch (error) {
            console.error('Error fetching recent searches:', error);
        }
    };

    const handleCheck = async (e) => {
        e.preventDefault();
        if (!query.trim()) return;

        setLoading(true);
        setError(null);
        setResult(null);

        try {
            const response = await axios.post(API_ENDPOINTS.CHECK, { query });
            const { analysis, grading, daoCase, full_state } = response.data; // Added destructuring
            setResult(response.data); // Keep this line to set the full result
            fetchRecentChecks(); // Refresh recent searches // Changed function call
        } catch (err) {
            setError(err.response?.data?.error || 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    const handleRecentSearchClick = (searchQuery) => {
        setQuery(searchQuery);
        setResult(null);
    };



    const trendingTopics = [
        "Delhi fog January 2026",
        "India budget 2026",
        "Cricket world cup updates",
        "Lok Sabha elections 2026"
    ];

    return (
        <div className="container">
            {!result && (
                <>
                    <div className="hero-section" style={{ textAlign: 'center', marginBottom: '3rem' }}>
                        <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', marginBottom: '1rem' }}>
                            VERIFY INDIAN NEWS
                        </h1>
                        <p style={{ fontSize: '1.2rem', color: '#666', maxWidth: '600px', margin: '0 auto 2rem' }}>
                            AI-powered fact-checking for Indian news. Get instant Trust Scores backed by verified sources.
                        </p>
                    </div>

                    <form onSubmit={handleCheck} style={{ marginBottom: '4rem' }}>
                        <div style={{ position: 'relative', maxWidth: '1100px', margin: '0 auto', display: 'flex' }}>
                            <input
                                type="text"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Enter a claim or news headline to verify..."
                                disabled={loading}
                                style={{
                                    flex: 1,
                                    paddingRight: '1rem',
                                    borderRight: 'none'
                                }}
                            />
                            <button
                                type="submit"
                                className="brutal-btn"
                                disabled={loading || !query.trim()}
                                style={{
                                    padding: '1rem 1.5rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    borderLeft: '4px solid black',
                                    whiteSpace: 'nowrap'
                                }}
                            >
                                {loading ? <Loader className="spin" size={20} /> : <Search size={20} />}
                                {loading ? 'CHECKING...' : 'CHECK'}
                            </button>
                        </div>
                    </form>

                    {/* Recent Searches */}
                    {recentChecks.length > 0 && (
                        <div className="brutal-box" style={{ marginBottom: '2rem', borderLeft: '10px solid var(--secondary-color)' }}>
                            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: 0 }}>
                                <Clock size={24} /> RECENT SEARCHES
                            </h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '1rem' }}>
                                {recentChecks.map((item) => (
                                    <div
                                        key={item._id}
                                        onClick={() => handleRecentSearchClick(item.query)}
                                        style={{
                                            padding: '0.8rem',
                                            background: '#f9f9f9',
                                            border: '2px solid black',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            transition: 'all 0.2s'
                                        }}
                                        onMouseEnter={(e) => e.currentTarget.style.background = 'var(--highlight-color)'}
                                        onMouseLeave={(e) => e.currentTarget.style.background = '#f9f9f9'}
                                    >
                                        <span style={{ fontWeight: 'bold' }}>
                                            {item.query.length > 60 ? item.query.substring(0, 60) + '...' : item.query}
                                        </span>
                                        <span style={{
                                            fontSize: '1.2rem',
                                            fontWeight: 'bold',
                                            color: item.grading?.score >= 40 && item.grading?.score <= 60 ? '#fbc531' :
                                                item.grading?.score >= 50 ? 'green' : 'red'
                                        }}>
                                            {item.grading?.score || 'N/A'}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                        {/* Trending Topics */}
                        <div className="brutal-box" style={{ borderLeft: '10px solid var(--accent-color)' }}>
                            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: 0 }}>
                                <TrendingUp size={24} /> TRENDING TOPICS
                            </h3>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '1rem' }}>
                                {trendingTopics.map((topic, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => handleRecentSearchClick(topic)}
                                        style={{
                                            padding: '0.5rem 1rem',
                                            background: 'white',
                                            border: '2px solid black',
                                            cursor: 'pointer',
                                            fontFamily: 'inherit',
                                            fontSize: '0.9rem',
                                            fontWeight: 'bold'
                                        }}
                                        onMouseEnter={(e) => e.currentTarget.style.background = 'var(--highlight-color)'}
                                        onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
                                    >
                                        {topic}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Tips */}
                        <div className="brutal-box" style={{ borderLeft: '10px solid var(--highlight-color)' }}>
                            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: 0 }}>
                                <Lightbulb size={24} /> TIPS FOR BEST RESULTS
                            </h3>
                            <ul style={{ marginTop: '1rem', lineHeight: '1.8' }}>
                                <li>Be specific with dates and locations</li>
                                <li>Include key names and numbers</li>
                                <li>Use complete sentences</li>
                                <li>Avoid opinion-based queries</li>
                            </ul>
                        </div>
                    </div>
                </>
            )}

            {error && (
                <div className="brutal-box" style={{ marginTop: '2rem', backgroundColor: '#ffe6e6', borderColor: 'red' }}>
                    <h3 style={{ color: 'red' }}>ERROR</h3>
                    <p>{error}</p>
                </div>
            )}

            {result && (
                <div className="result-section">
                    {result.daoCase && (
                        <div className="brutal-box" style={{
                            background: 'var(--highlight-color)',
                            border: '5px solid black',
                            marginBottom: '2rem',
                            padding: '2rem'
                        }}>
                            <h2 style={{ margin: '0 0 1rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <Scale size={28} /> ESCALATED TO TRUTH DAO
                            </h2>
                            <p style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>
                                {result.daoCase.message}
                            </p>
                            <p style={{ fontWeight: 'bold' }}>
                                Case ID: <code style={{ background: 'white', padding: '0.3rem 0.6rem' }}>{result.daoCase.caseId}</code>
                            </p>
                            <p style={{ fontSize: '0.9rem', marginTop: '1rem', fontStyle: 'italic' }}>
                                Community voting deadline: {new Date(result.daoCase.votingDeadline).toLocaleDateString()}
                            </p>
                            <button
                                className="brutal-btn"
                                style={{ marginTop: '1rem', background: 'black', color: 'white' }}
                                onClick={() => navigate(`/app/dao/${result.daoCase.caseId}`)}
                            >
                                VOTE ON THIS CASE →
                            </button>
                        </div>
                    )}

                    {result.grading && (
                        <div className={`score-card ${getScoreClass(result.grading.score)}`}>
                            <h1 style={{ fontSize: '5rem', margin: 0 }}>{result.grading.score}</h1>
                            <h3>TRUST SCORE</h3>
                            <p style={{ fontStyle: 'italic' }}>"{result.grading.reasoning}"</p>
                        </div>
                    )}

                    <div className="analysis-box brutal-box">
                        <h3>// DETAILED INVESTIGATION LOG</h3>
                        <div className="markdown-content" style={{ textAlign: 'left', whiteSpace: 'pre-wrap' }}>
                            {(() => {
                                let content = result.analysis;

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
                                    const mainContent = content.split('### Sources')[0].trim();
                                    return mainContent.split('\n').map((line, i) => {
                                        const cleanLine = line.replace(/\*\*/g, '').replace(/\{/g, '').replace(/\}/g, '');
                                        if (line.trim().startsWith('#')) {
                                            return (
                                                <h4 key={i} style={{
                                                    fontSize: '1.1rem',
                                                    fontWeight: 'bold',
                                                    marginTop: '1.5rem',
                                                    marginBottom: '0.5rem',
                                                    color: 'black',
                                                    textTransform: 'uppercase'
                                                }}>
                                                    {cleanLine.replace(/#/g, '').trim()}
                                                </h4>
                                            );
                                        }
                                        return <div key={i}>{cleanLine}</div>;
                                    });
                                }
                                return null;
                            })()}
                        </div>
                    </div>

                    {result.analysis?.includes('### Sources') && (
                        <div className="brutal-box" style={{ marginTop: '2rem', borderLeft: '10px solid var(--secondary-color)' }}>
                            <h3>// SOURCES & REFERENCES</h3>
                            <div style={{ textAlign: 'left' }}>
                                {result.analysis.split('### Sources')[1]?.split('\n')
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
            )}
        </div>
    );
};

function getScoreClass(score) {
    if (score >= 80) return 'score-high';
    if (score >= 50) return 'score-medium';
    return 'score-low';
}

export default Home;
