import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import DashboardLayout from './pages/DashboardLayout';
import DashboardOverview from './pages/DashboardOverview';
import RiskAssessment from './pages/RiskAssessment';
import PredictionHistory from './pages/PredictionHistory';
import HealthTrends from './pages/HealthTrends';
import Reports from './pages/Reports';
import Profile from './pages/Profile';

export default function App() {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('glucorisk_user');
    return saved ? JSON.parse(saved) : null;
  });

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    localStorage.setItem('glucorisk_user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('glucorisk_user');
  };

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Login Route */}
        <Route 
          path="/login" 
          element={
            user ? <Navigate to="/dashboard" replace /> : <Login onLoginSuccess={handleLoginSuccess} />
          } 
        />

        {/* Authenticated Dashboard Nested Routes */}
        <Route 
          path="/dashboard" 
          element={
            user ? <DashboardLayout user={user} onLogout={handleLogout} /> : <Navigate to="/login" replace />
          }
        >
          <Route index element={<DashboardOverview />} />
          <Route path="risk-assessment" element={<RiskAssessment />} />
          <Route path="history" element={<PredictionHistory />} />
          <Route path="trends" element={<HealthTrends />} />
          <Route path="reports" element={<Reports />} />
          <Route path="profile" element={<Profile />} />
        </Route>

        {/* Default Catch-all Route */}
        <Route path="*" element={<Navigate to={user ? "/dashboard" : "/login"} replace />} />
      </Routes>
    </BrowserRouter>
  );
}
