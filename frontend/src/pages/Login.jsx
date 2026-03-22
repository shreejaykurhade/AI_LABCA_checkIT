import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const { loginWithGoogle } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState('');

    const handleLogin = async () => {
        try {
            await loginWithGoogle();
            navigate('/app');
        } catch (err) {
            setError('Authentication failed. Check console.');
        }
    };

    return (
        <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
            <div className="brutal-box" style={{ padding: '3rem', maxWidth: '400px', width: '100%', textAlign: 'center' }}>
                <h2 style={{ fontSize: '2.5rem', marginBottom: '2rem' }}>IDENTIFY YOURSELF</h2>

                {error && <p style={{ color: 'red' }}>{error}</p>}

                <button onClick={handleLogin} className="brutal-btn" style={{ width: '100%' }}>
                    LOGIN WITH GOOGLE
                </button>
            </div>
        </div>
    );
};

export default Login;
