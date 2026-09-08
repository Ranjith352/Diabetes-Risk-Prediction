import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';

export default function DashboardLayout({ user, onLogout }) {
  const location = useLocation();

  const getTitle = () => {
    switch (location.pathname) {
      case '/dashboard/risk-assessment':
        return 'Diabetes Risk Assessment';
      case '/dashboard/history':
        return 'Prediction History';
      case '/dashboard/trends':
        return 'Health Trends & ML Analytics';
      case '/dashboard/reports':
        return 'Medical Risk Reports';
      case '/dashboard/profile':
        return 'Practitioner Profile';
      default:
        return 'Dashboard Overview';
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex">
      {/* Sidebar Navigation */}
      <Sidebar user={user} onLogout={onLogout} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar title={getTitle()} />
        <main className="flex-1 p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
