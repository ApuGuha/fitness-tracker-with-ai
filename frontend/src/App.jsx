import React from 'react';
import { Routes, Route, Link, Navigate } from 'react-router-dom';
import { Activity, LogOut } from 'lucide-react';

// Import pages
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import Consultation from './pages/Consultation';
import PlanView from './pages/PlanView';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  const token = localStorage.getItem('token');
  const isAuthenticated = !!token;

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login'; // hard reload to clear any cached states
  };

  return (
    <div className="app-container">
      <nav className="navbar">
        <Link to={isAuthenticated ? "/dashboard" : "/"} className="nav-brand">
          <Activity color="var(--accent-primary)" />
          <span>Fit<span className="gradient-text">Sync</span> AI</span>
        </Link>
        <div className="nav-links">
          {isAuthenticated ? (
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <Link to="/dashboard" className="btn-secondary" style={{ border: 'none', padding: '0.5rem 1rem' }}>Dashboard</Link>
              <button onClick={handleLogout} className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', border: '1px solid rgba(255,255,255,0.1)' }}>
                <LogOut size={16} /> Logout
              </button>
            </div>
          ) : (
            <Link to="/login" className="btn-primary">Login / Sign up</Link>
          )}
        </div>
      </nav>

      <main className="main-content">
        <Routes>
          <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />} />
          <Route path="/login" element={!isAuthenticated ? <Auth /> : <Navigate to="/dashboard" replace />} />
          
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          
          <Route path="/consultation" element={
            <ProtectedRoute>
              <Consultation />
            </ProtectedRoute>
          } />
          
          <Route path="/plan/:id" element={
            <ProtectedRoute>
              <PlanView />
            </ProtectedRoute>
          } />
        </Routes>
      </main>
    </div>
  );
}

export default App;
