import React, { useState, useEffect } from 'react';
import { Search, Bell, Clock, Cpu, Sparkles } from 'lucide-react';

export default function Navbar({ title = "Dashboard" }) {
  const [time, setTime] = useState(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    }, 10000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="h-20 bg-slate-900/80 backdrop-blur-md border-b border-slate-800 px-8 flex items-center justify-between sticky top-0 z-20">
      {/* Title & Path */}
      <div>
        <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
          {title}
        </h2>
        <p className="text-xs text-slate-400">Clinical Machine Learning Assessment Suite</p>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-5">
        {/* Search Input */}
        <div className="relative hidden md:block">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search patients, records..."
            className="pl-10 pr-4 py-2 bg-slate-800/80 text-sm text-slate-200 placeholder-slate-400 rounded-xl border border-slate-700/60 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 w-64 transition-all"
          />
        </div>

        {/* Live Clock Badge */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800/50 border border-slate-700/50 text-xs font-mono text-slate-300">
          <Clock className="h-3.5 w-3.5 text-teal-400" />
          <span>{time}</span>
        </div>

        {/* AI Model Active Tag */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-teal-500/10 border border-teal-500/20 text-xs text-teal-300 font-medium">
          <Cpu className="h-3.5 w-3.5 text-teal-400" />
          <span>5 ML Ensemble Active</span>
        </div>

        {/* Notification Trigger */}
        <button className="relative p-2 text-slate-400 hover:text-slate-200 bg-slate-800/60 rounded-xl border border-slate-700/50 hover:bg-slate-800 transition-colors">
          <Bell className="h-4 w-4" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-teal-400 ring-2 ring-slate-900"></span>
        </button>
      </div>
    </header>
  );
}
