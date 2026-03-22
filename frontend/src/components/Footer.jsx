import React from 'react';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="container">
                <p style={{ fontFamily: 'monospace', fontSize: '0.9rem', marginBottom: '1rem' }}>
                    // SYSTEM STATUS: ONLINE | SECIV: ACTIVE
                </p>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap' }}>
                    <a href="#" style={{ color: 'var(--highlight-color)' }}>Manifesto</a>
                    <a href="#" style={{ color: 'var(--highlight-color)' }}>Data Sources</a>
                    <a href="#" style={{ color: 'var(--highlight-color)' }}>Privacy Protocol</a>
                </div>
                <p style={{ marginTop: '2rem', opacity: 0.6, fontSize: '0.8rem' }}>
                    &copy; 2026 INDIAN FACT-CHECKING INITIATIVE. NO RIGHTS RESERVED.
                </p>
            </div>
        </footer>
    );
};

export default Footer;
