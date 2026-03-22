import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Home from './pages/Home';
import History from './pages/History';
import Result from './pages/Result';
import DAOVoting from './pages/DAOVoting';
import DAOCases from './pages/DAOCases';
import './App.css';

// Protected Route Wrapper
const ProtectedRoute = ({ children }) => {
    const { user } = useAuth();
    if (!user) {
        return <Navigate to="/login" replace />;
    }
    return children;
};

const AppRoutes = () => {
    return (
        <>
            <Navbar />
            <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/login" element={<Login />} />

                {/* Protected Application Routes */}
                <Route path="/app" element={
                    <ProtectedRoute>
                        <Home />
                    </ProtectedRoute>
                } />
                <Route path="/app/history" element={
                    <ProtectedRoute>
                        <History />
                    </ProtectedRoute>
                } />
                <Route path="/app/result/:id" element={
                    <ProtectedRoute>
                        <Result />
                    </ProtectedRoute>
                } />
                <Route path="/app/dao/:caseId" element={
                    <ProtectedRoute>
                        <DAOVoting />
                    </ProtectedRoute>
                } />
                <Route path="/app/dao-cases" element={
                    <ProtectedRoute>
                        <DAOCases />
                    </ProtectedRoute>
                } />
            </Routes>
        </>
    );
};

function App() {
    return (
        <Router>
            <AuthProvider>
                <AppRoutes />
            </AuthProvider>
        </Router>
    );
}

export default App;
