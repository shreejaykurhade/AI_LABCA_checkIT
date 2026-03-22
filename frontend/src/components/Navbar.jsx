import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShieldCheck, History, Search, LogOut, Scale } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const location = useLocation();
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    // Don't show navbar on landing or login
    if (location.pathname === '/' || location.pathname === '/login') return null;

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <nav className="navbar">
            <div className="nav-brand">
                <ShieldCheck className="brand-icon" size={32} />
                <span>
                    <span style={{ color: 'black' }}>Check</span>
                    <span style={{ color: 'var(--accent-color)' }}>IT</span>
                </span>
            </div>
            <div className="nav-links" style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                <div className="user-badge" style={{ fontWeight: 'bold' }}>
                    USER: {user?.name || 'GUEST'}
                </div>
                <Link to="/app" className={location.pathname === '/app' ? 'active' : ''} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <Search size={20} /> SEARCH
                </Link>
                <Link to="/app/history" className={location.pathname === '/app/history' ? 'active' : ''} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <History size={20} /> ARCHIVES
                </Link>
                <Link to="/app/dao-cases" className={location.pathname === '/app/dao-cases' ? 'active' : ''} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <Scale size={20} /> DAO VOTES
                </Link>
                <button className="brutal-btn" onClick={handleLogout} style={{ padding: '0.5rem 1rem', fontSize: '0.9rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <LogOut size={16} /> LOGOUT
                </button>
            </div>
        </nav>
    );
};

export default Navbar;
