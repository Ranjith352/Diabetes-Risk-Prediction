import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  Activity, 
  History, 
  TrendingUp, 
  FileText, 
  User, 
  LogOut, 
  LayoutDashboard,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';

export default function Sidebar({ user, onLogout }) {
  const navigate = useNavigate();

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, exact: true },
    { name: 'Risk Assessment', path: '/dashboard/risk-assessment', icon: Activity },
    { name: 'Prediction History', path: '/dashboard/history', icon: History },
    { name: 'Health Trends', path: '/dashboard/trends', icon: TrendingUp },
    { name: 'Reports', path: '/dashboard/reports', icon: FileText },
    { name: 'Profile', path: '/dashboard/profile', icon: User },
  ];

  const handleLogoutClick = () => {
    if (onLogout) onLogout();
    navigate('/login');
  };

  return (
    <aside className="w-64 bg-slate-900/95 border-r border-slate-800 flex flex-col h-screen sticky top-0 z-30 select-none">
      {/* Brand Header */}
      <div className="p-6 flex items-center gap-3 border-b border-slate-800/80">
        <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-teal-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-teal-500/20">
          <Activity className="h-6 w-6 text-slate-950 stroke-[2.5]" />
        </div>
        <div>
          <h1 className="font-bold text-slate-100 text-lg leading-tight tracking-tight">Gluco<span className="text-teal-400">Risk</span></h1>
          <p className="text-xs text-slate-400 font-medium">Predictive AI Suite</p>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
        <div className="px-3 pb-2 text-[10px] font-semibold text-slate-400 tracking-wider uppercase">
          Core Engine
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.exact}
              className={({ isActive }) =>
                `flex items-center justify-between px-3.5 py-3 rounded-xl font-medium text-sm transition-all duration-200 group ${
                  isActive
                    ? 'bg-teal-500/10 text-teal-400 border border-teal-500/30 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`
              }
            >
              <div className="flex items-center gap-3">
                <Icon className="h-5 w-5 transition-transform duration-200 group-hover:scale-110" />
                <span>{item.name}</span>
              </div>
              <ChevronRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity text-slate-500" />
            </NavLink>
          );
        })}
      </nav>

      {/* Status & User Footer */}
      <div className="p-4 border-t border-slate-800/80 space-y-4">
        {/* ML Status Card */}
        <div className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-700/50 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></div>
            <span className="text-xs font-medium text-slate-300">Model Engine Ready</span>
          </div>
          <ShieldCheck className="h-4 w-4 text-teal-400" />
        </div>

        {/* User Badge & Logout */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-3 overflow-hidden">
            <img 
              src={user?.avatar || "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=150&auto=format&fit=crop"} 
              alt="User Avatar" 
              className="h-9 w-9 rounded-full object-cover border border-teal-500/30"
            />
            <div className="truncate">
              <p className="text-xs font-semibold text-slate-200 truncate">{user?.name || "Dr. Sarah Jenkins"}</p>
              <p className="text-[11px] text-slate-400 truncate">{user?.role || "Specialist"}</p>
            </div>
          </div>

          <button
            onClick={handleLogoutClick}
            title="Log Out"
            className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
