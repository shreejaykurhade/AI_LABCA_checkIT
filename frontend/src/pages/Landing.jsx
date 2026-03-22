import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Globe, ShieldAlert, Database, Lock, Search, Scale } from 'lucide-react';
import Footer from '../components/Footer';

const Landing = () => {
    return (
        <div className="landing-page" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', position: 'relative' }}>
            <div style={{ position: 'absolute', top: '1rem', right: '2rem', zIndex: 100 }}>
                <Link to="/login">
                    <button className="brutal-btn" style={{ fontSize: '1rem', padding: '0.5rem 1.5rem', background: 'white', color: 'black' }}>
                        LOGIN
                    </button>
                </Link>
            </div>

            <header className="hero-section fade-in" style={{ marginTop: '6rem', marginBottom: '4rem', textAlign: 'center', padding: '0 2rem' }}>
                <h1 style={{ fontSize: 'clamp(3rem, 8vw, 6rem)', fontWeight: '900', lineHeight: '1.1', marginBottom: '2rem' }}>
                    DECODE THE <span style={{ color: 'var(--accent-color)', textDecoration: 'underline', textDecorationThickness: '8px' }}>MEDIA</span> MATRIX.
                </h1>
                <h2 style={{ fontSize: 'clamp(1.5rem, 4vw, 2.5rem)', marginBottom: '2rem', color: '#555', fontWeight: '700' }}>
                    Autonomous. Unbiased. Real-time.
                </h2>

                <p style={{ fontSize: 'clamp(1rem, 2vw, 1.3rem)', maxWidth: '900px', margin: '0 auto 3rem', lineHeight: '1.8', fontWeight: '500' }}>
                    In an era of deepfakes and viral misinformation, <strong style={{ color: 'var(--accent-color)' }}>CheckIT</strong> is your digital defense system.
                    We deploy autonomous AI agents to scour trusted Indian databases, cross-reference government records (PIB),
                    and analyze news patterns to give you a definitive <strong>Truth Score</strong>.
                </p>

                <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '4rem' }}>
                    <Link to="/login">
                        <button className="brutal-btn" style={{ fontSize: '1.5rem', padding: '1.2rem 2.5rem', background: 'black', color: 'white', fontWeight: '900' }}>
                            SEARCH YOUR QUERY <ArrowRight style={{ marginLeft: '10px' }} size={28} />
                        </button>
                    </Link>
                    <a href="#how-it-works">
                        <button className="brutal-btn" style={{ fontSize: '1.5rem', padding: '1.2rem 2.5rem', background: 'white', color: 'black', fontWeight: '900' }}>
                            HOW IT WORKS
                        </button>
                    </a>
                </div>
            </header>

            <section style={{ padding: '4rem 2rem', marginBottom: '4rem' }} className="slide-in-left">
                <div className="container">
                    <h2 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', marginBottom: '2rem', textAlign: 'center', fontWeight: '900' }}>
                        WHY YOU NEED CheckIT
                    </h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', marginTop: '3rem' }}>
                        <div style={{ background: 'white', padding: '2rem', border: '5px solid black' }}>
                            <ShieldAlert size={48} color="var(--accent-color)" />
                            <h3 style={{ fontSize: '1.8rem', marginTop: '1rem', fontWeight: '800' }}>Combat Fake News</h3>
                            <p style={{ fontSize: '1.1rem', lineHeight: '1.6', marginTop: '1rem' }}>
                                Don't fall for viral hoaxes. Verify claims in seconds with AI-powered fact-checking across 15+ trusted Indian sources.
                            </p>
                        </div>
                        <div style={{ background: 'white', padding: '2rem', border: '5px solid black' }}>
                            <Globe size={48} color="var(--secondary-color)" />
                            <h3 style={{ fontSize: '1.8rem', marginTop: '1rem', fontWeight: '800' }}>Stay Informed</h3>
                            <p style={{ fontSize: '1.1rem', lineHeight: '1.6', marginTop: '1rem' }}>
                                Get real-time analysis from PIB, BoomLive, AltNews, and major news outlets. Know what's happening in India, instantly.
                            </p>
                        </div>
                        <div style={{ background: 'white', padding: '2rem', border: '5px solid black' }}>
                            <Lock size={48} color="var(--highlight-color)" />
                            <h3 style={{ fontSize: '1.8rem', marginTop: '1rem', fontWeight: '800' }}>Trust the Score</h3>
                            <p style={{ fontSize: '1.1rem', lineHeight: '1.6', marginTop: '1rem' }}>
                                Our AI Grader analyzes evidence quality, source authority, and consistency to give you a Truth Score (0-100).
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <section id="how-it-works" className="container slide-in-left" style={{ marginBottom: '4rem' }}>
                <h2 style={{ fontSize: 'clamp(2.5rem, 6vw, 4rem)', marginBottom: '3rem', textAlign: 'center', fontWeight: '900' }}>
                    // SYSTEM ARCHITECTURE
                </h2>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
                    <div className="brutal-box" style={{ borderLeft: '10px solid var(--secondary-color)', padding: '2rem' }}>
                        <Search size={56} color="var(--secondary-color)" />
                        <h3 style={{ fontSize: '2rem', marginTop: '1rem', fontWeight: '800' }}>1. INVESTIGATOR</h3>
                        <p style={{ fontSize: '1.1rem', lineHeight: '1.7', marginTop: '1rem', wordBreak: 'break-word' }}>
                            Our agent crawls valid Indian domains:{' '}
                            <code style={{ background: '#f0f0f0', padding: '0.2rem 0.5rem', whiteSpace: 'nowrap' }}>boomlive.in</code>,{' '}
                            <code style={{ background: '#f0f0f0', padding: '0.2rem 0.5rem', whiteSpace: 'nowrap' }}>altnews.in</code>,{' '}
                            <code style={{ background: '#f0f0f0', padding: '0.2rem 0.5rem', whiteSpace: 'nowrap' }}>pib.gov.in</code>.{' '}
                            It ignores noise and focuses on verified archives.
                        </p>
                    </div>

                    <div className="brutal-box" style={{ borderLeft: '10px solid var(--accent-color)', padding: '2rem' }}>
                        <Database size={56} color="var(--accent-color)" />
                        <h3 style={{ fontSize: '2rem', marginTop: '1rem', fontWeight: '800' }}>2. ANALYST</h3>
                        <p style={{ fontSize: '1.1rem', lineHeight: '1.7', marginTop: '1rem' }}>
                            Powered by <strong>Gemini AI</strong>. It reads thousands of words in seconds to find contradictions
                            and context that humans might miss. Filters out irrelevant content automatically.
                        </p>
                    </div>

                    <div className="brutal-box" style={{ borderLeft: '10px solid var(--highlight-color)', padding: '2rem' }}>
                        <Lock size={56} color="var(--highlight-color)" />
                        <h3 style={{ fontSize: '2rem', marginTop: '1rem', fontWeight: '800' }}>3. GRADER</h3>
                        <p style={{ fontSize: '1.1rem', lineHeight: '1.7', marginTop: '1rem' }}>
                            We don't just say True/False. We give you a <strong>Truth Score (0-100)</strong> based on evidence quality,
                            source authority (government sources get +100), and factual consistency.
                        </p>
                    </div>
                </div>
            </section>

            <section style={{ padding: '4rem 2rem', marginBottom: '4rem' }}>
                <div className="container" style={{ textAlign: 'center' }}>
                    <h2 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', marginBottom: '2rem', fontWeight: '900', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
                        <Scale size={56} /> THE TRUTH DAO
                    </h2>
                    <p style={{ fontSize: 'clamp(1rem, 2vw, 1.3rem)', maxWidth: '900px', margin: '0 auto 3rem', lineHeight: '1.8' }}>
                        When AI encounters a <strong style={{ color: 'var(--highlight-color)' }}>gray area</strong> (Trust Score 40-60%),
                        the case is automatically escalated to our <strong style={{ color: 'var(--highlight-color)' }}>Truth DAO</strong>
                        - a decentralized community of verified fact-checkers and journalists.
                    </p>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', textAlign: 'left' }}>
                        <div style={{ padding: '2rem', background: 'white', border: '5px solid black' }}>
                            <h3 style={{ fontSize: '1.8rem', fontWeight: '800', marginBottom: '1rem' }}>1. Auto-Escalation</h3>
                            <p style={{ fontSize: '1.1rem', lineHeight: '1.6' }}>
                                Contradictory sources? No problem. Cases with ambiguous scores are sent to the community for human review.
                            </p>
                        </div>
                        <div style={{ padding: '2rem', background: 'white', border: '5px solid black' }}>
                            <h3 style={{ fontSize: '1.8rem', fontWeight: '800', marginBottom: '1rem' }}>2. Community Voting</h3>
                            <p style={{ fontSize: '1.1rem', lineHeight: '1.6' }}>
                                Token holders vote TRUE or FALSE with reasoning. Majority consensus determines the final verdict.
                            </p>
                        </div>
                        <div style={{ padding: '2rem', background: 'white', border: '5px solid black' }}>
                            <h3 style={{ fontSize: '1.8rem', fontWeight: '800', marginBottom: '1rem' }}>3. Incentivized Truth</h3>
                            <p style={{ fontSize: '1.1rem', lineHeight: '1.6' }}>
                                Voters aligned with the eventual truth earn rewards, creating an "Incentivized Truth Market."
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <section style={{ padding: '4rem 2rem', marginBottom: '4rem' }}>
                <div className="container" style={{ textAlign: 'center' }}>
                    <h2 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', marginBottom: '2rem', fontWeight: '900' }}>
                        HOW TO USE CheckIT
                    </h2>
                    <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'left' }}>
                        <div style={{ marginBottom: '2rem', padding: '1.5rem', background: 'white', border: '5px solid black' }}>
                            <h3 style={{ fontSize: '1.8rem', fontWeight: '800', marginBottom: '0.5rem' }}>Step 1: Enter Your Query</h3>
                            <p style={{ fontSize: '1.1rem', lineHeight: '1.6' }}>
                                Type any claim you want to verify: "Delhi flights delayed due to fog", "Did X politician say Y?", "Is Z news true?"
                            </p>
                        </div>
                        <div style={{ marginBottom: '2rem', padding: '1.5rem', background: 'white', border: '5px solid black' }}>
                            <h3 style={{ fontSize: '1.8rem', fontWeight: '800', marginBottom: '0.5rem' }}>Step 2: AI Investigates</h3>
                            <p style={{ fontSize: '1.1rem', lineHeight: '1.6' }}>
                                Our system searches 15+ trusted sources in real-time, analyzing the latest news from PIB, Times of India, NDTV, and more.
                            </p>
                        </div>
                        <div style={{ padding: '1.5rem', background: 'white', border: '5px solid black' }}>
                            <h3 style={{ fontSize: '1.8rem', fontWeight: '800', marginBottom: '0.5rem' }}>Step 3: Get Your Truth Score</h3>
                            <p style={{ fontSize: '1.1rem', lineHeight: '1.6' }}>
                                Receive a detailed analysis with evidence, sources, and a Truth Score. 100 = Verified True. 0 = Proven False.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default Landing;
