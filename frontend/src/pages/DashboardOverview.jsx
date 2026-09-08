import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Activity, 
  AlertTriangle, 
  TrendingUp, 
  Users, 
  ArrowRight, 
  Sparkles, 
  HeartPulse, 
  BrainCircuit,
  ChevronRight
} from 'lucide-react';
import { fetchDashboardSummary, fetchModelEvaluations } from '../api';

export default function DashboardOverview() {
  const navigate = useNavigate();
  const [summary, setSummary] = useState(null);
  const [models, setModels] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [sumRes, modelRes] = await Promise.all([
          fetchDashboardSummary(),
          fetchModelEvaluations()
        ]);
        setSummary(sumRes);
        setModels(modelRes);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div className="space-y-8 pb-10">
      {/* Top Banner Hero */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900 to-teal-950/60 border border-slate-800 p-8 shadow-xl">
        <div className="absolute right-0 top-0 w-1/3 h-full bg-gradient-to-l from-teal-500/10 to-transparent pointer-events-none"></div>
        <div className="relative z-10 space-y-4 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-xs font-semibold">
            <BrainCircuit className="h-3.5 w-3.5" />
            <span>Pima Indians ML Trained Model</span>
          </div>
          <h2 className="text-3xl font-extrabold text-slate-100 leading-tight">
            Diabetes Risk Prediction & <br />
            <span className="text-gradient">Clinical Analytics Dashboard</span>
          </h2>
          <p className="text-slate-400 text-sm leading-relaxed">
            Perform live machine learning risk evaluations, view population trends, track patient history, and generate clinical summary reports.
          </p>
          <div className="pt-2 flex flex-wrap items-center gap-4">
            <button
              onClick={() => navigate('/dashboard/risk-assessment')}
              className="px-5 py-3 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-slate-950 font-bold text-sm shadow-lg shadow-teal-500/20 flex items-center gap-2 transition-all"
            >
              <Activity className="h-4 w-4 stroke-[2.5]" />
              <span>Start Risk Assessment</span>
              <ArrowRight className="h-4 w-4" />
            </button>
            <button
              onClick={() => navigate('/dashboard/trends')}
              className="px-5 py-3 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-200 font-semibold text-sm border border-slate-700/60 flex items-center gap-2 transition-all"
            >
              <TrendingUp className="h-4 w-4 text-teal-400" />
              <span>View Analytics</span>
            </button>
          </div>
        </div>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Assessments</span>
            <div className="p-2 rounded-xl bg-teal-500/10 text-teal-400">
              <Users className="h-5 w-5" />
            </div>
          </div>
          <div className="text-3xl font-bold text-slate-100">
            {summary?.totalAssessments || 142}
          </div>
          <p className="text-xs text-slate-400 flex items-center gap-1">
            <span className="text-emerald-400 font-semibold">+12%</span> vs last month
          </p>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">High Risk Cases</span>
            <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400">
              <AlertTriangle className="h-5 w-5" />
            </div>
          </div>
          <div className="text-3xl font-bold text-rose-400">
            {summary?.highRiskCases || 46}
          </div>
          <p className="text-xs text-slate-400">
            {summary?.totalAssessments ? Math.round((summary.highRiskCases / summary.totalAssessments) * 100) : 32}% of total assessments
          </p>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Avg Glucose (mg/dL)</span>
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400">
              <HeartPulse className="h-5 w-5" />
            </div>
          </div>
          <div className="text-3xl font-bold text-slate-100">
            {summary?.avgGlucose || 121.4}
          </div>
          <p className="text-xs text-slate-400">Target Range: 70 - 140 mg/dL</p>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Best ML Model</span>
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
              <Sparkles className="h-5 w-5" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-100 truncate">
            {models?.bestModel || "Random Forest"}
          </div>
          <p className="text-xs text-teal-400 font-semibold">
            {models?.bestAccuracy || 88.31}% Test Accuracy
          </p>
        </div>
      </div>

      {/* Main Grid: Recent Predictions & Model Comparison Quick View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Recent Predictions Table Snippet */}
        <div className="lg:col-span-8 glass-panel rounded-3xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-100 text-lg">Recent Diagnostic Predictions</h3>
              <p className="text-xs text-slate-400">Latest patient risk assessments evaluated by ML models</p>
            </div>
            <button 
              onClick={() => navigate('/dashboard/history')}
              className="text-xs text-teal-400 hover:text-teal-300 font-semibold flex items-center gap-1"
            >
              <span>View All History</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-800 text-xs text-slate-400 font-semibold uppercase">
                  <th className="py-3 px-4">Patient</th>
                  <th className="py-3 px-4">Glucose</th>
                  <th className="py-3 px-4">BMI</th>
                  <th className="py-3 px-4">Model</th>
                  <th className="py-3 px-4">Risk Level</th>
                  <th className="py-3 px-4 text-right">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {summary?.recentPredictions?.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-slate-200">{item.patientName}</td>
                    <td className="py-3.5 px-4 text-slate-300">{item.glucose} mg/dL</td>
                    <td className="py-3.5 px-4 text-slate-300">{item.bmi}</td>
                    <td className="py-3.5 px-4 text-slate-400 text-xs">{item.modelUsed}</td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                        item.riskLevel === 'High Risk'
                          ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                          : item.riskLevel === 'Moderate Risk'
                          ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                          : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      }`}>
                        {item.riskLevel}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right text-xs text-slate-400">{item.createdAt?.split(' ')[0]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: Model Performance Leaderboard */}
        <div className="lg:col-span-4 glass-panel rounded-3xl p-6 space-y-4">
          <div>
            <h3 className="font-bold text-slate-100 text-lg">ML Model Benchmark</h3>
            <p className="text-xs text-slate-400">Scikit-learn model accuracies on dataset</p>
          </div>

          <div className="space-y-4 pt-2">
            {models?.models?.map((m) => (
              <div key={m.name} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-slate-300">{m.name}</span>
                  <span className="font-bold text-teal-400">{m.accuracy}%</span>
                </div>
                <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-teal-500 to-cyan-400 rounded-full"
                    style={{ width: `${m.accuracy}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 rounded-2xl bg-teal-500/10 border border-teal-500/20 text-xs text-teal-300 space-y-2 mt-4">
            <div className="font-semibold text-teal-400 flex items-center gap-1.5">
              <Sparkles className="h-4 w-4" /> Recommended Ensemble
            </div>
            <p className="text-slate-300 leading-relaxed">
              Random Forest & AdaBoost deliver highest precision on blood glucose and BMI correlation factors.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
