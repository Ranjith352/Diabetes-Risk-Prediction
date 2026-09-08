import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, Lock, Mail, ArrowRight, ShieldCheck, Cpu, Sparkles, CheckCircle2 } from 'lucide-react';
import { loginUser } from '../api';

export default function Login({ onLoginSuccess }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState('admin@diabetes.org');
  const [password, setPassword] = useState('password123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const data = await loginUser({ email, password });
      if (data.token) {
        if (onLoginSuccess) onLoginSuccess(data.user);
        navigate('/dashboard');
      } else {
        setError(data.error || 'Login failed. Please check credentials.');
      }
    } catch (err) {
      setError('Connection error to ML engine API');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = () => {
    setEmail('admin@diabetes.org');
    setPassword('demo2026');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Dynamic Background Glow Effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center z-10">
        
        {/* Left Side: Brand & Feature Showcase */}
        <div className="lg:col-span-7 space-y-8 pr-0 lg:pr-6">
          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-xs font-semibold tracking-wide uppercase">
            <Sparkles className="h-4 w-4 text-teal-400" />
            <span>AI Clinical Risk Platform</span>
          </div>

          <div className="space-y-4">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-100 leading-tight">
              Predictive Diabetes Risk <br />
              <span className="text-gradient">Intelligence System</span>
            </h1>
            <p className="text-slate-400 text-base leading-relaxed">
              Empowering healthcare providers and individuals with high-precision machine learning ensembles (Naive Bayes, Random Forest, AdaBoost) for early glycemic risk detection.
            </p>
          </div>

          {/* Feature Highlights Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="glass-card p-4 rounded-2xl flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-teal-500/10 text-teal-400">
                <Cpu className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-semibold text-slate-200 text-sm">5 ML Ensembles</h4>
                <p className="text-xs text-slate-400">Random Forest, Boosting, Naive Bayes & Decision Trees.</p>
              </div>
            </div>

            <div className="glass-card p-4 rounded-2xl flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-semibold text-slate-200 text-sm">Clinical Accuracy</h4>
                <p className="text-xs text-slate-400">Trained on Pima Indians clinical health benchmarks.</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6 pt-2 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" /> Real-time Inferences
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" /> Automated Trend Charts
            </div>
          </div>
        </div>

        {/* Right Side: Glass Login Form */}
        <div className="lg:col-span-5">
          <div className="glass-panel p-8 rounded-3xl shadow-2xl space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-teal-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-teal-500/20">
                  <Activity className="h-6 w-6 text-slate-950 stroke-[2.5]" />
                </div>
                <span className="font-bold text-slate-100 text-lg">Sign In</span>
              </div>
              <button 
                onClick={handleDemoLogin}
                className="text-xs font-medium text-teal-400 hover:text-teal-300 underline underline-offset-4"
              >
                Auto-fill Demo
              </button>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-medium">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Work Email</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="doctor@hospital.org"
                    className="w-full pl-10 pr-4 py-3 bg-slate-950/80 text-sm text-slate-200 placeholder-slate-400 rounded-xl border border-slate-700/60 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-10 pr-4 py-3 bg-slate-950/80 text-sm text-slate-200 placeholder-slate-400 rounded-xl border border-slate-700/60 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-4 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-slate-950 font-bold rounded-xl shadow-lg shadow-teal-500/25 flex items-center justify-center gap-2 transition-all duration-200 active:scale-[0.99] disabled:opacity-50 mt-2"
              >
                {loading ? (
                  <span>Authenticating...</span>
                ) : (
                  <>
                    <span>Enter Diagnostic Console</span>
                    <ArrowRight className="h-4 w-4 stroke-[3]" />
                  </>
                )}
              </button>
            </form>

            <div className="pt-2 text-center text-[11px] text-slate-400">
              Encrypted 256-bit HIPAA compliant clinical portal
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
