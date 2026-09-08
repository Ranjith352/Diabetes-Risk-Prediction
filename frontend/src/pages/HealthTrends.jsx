import React, { useEffect, useState } from 'react';
import { 
  TrendingUp, 
  BarChart2, 
  PieChart as PieIcon, 
  Cpu, 
  Activity, 
  Zap,
  CheckCircle2
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  ScatterChart, 
  Scatter, 
  XAxis, 
  YAxis, 
  Tooltip, 
  BarChart, 
  Bar, 
  CartesianGrid, 
  Legend, 
  Cell 
} from 'recharts';
import { fetchHealthTrends, fetchModelEvaluations } from '../api';

export default function HealthTrends() {
  const [trends, setTrends] = useState(null);
  const [models, setModels] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [tRes, mRes] = await Promise.all([
          fetchHealthTrends(),
          fetchModelEvaluations()
        ]);
        setTrends(tRes);
        setModels(mRes);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div className="space-y-8 pb-12">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-panel p-6 rounded-3xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-semibold text-teal-400 uppercase tracking-wider">
            <TrendingUp className="h-4 w-4" />
            <span>Population & Model Analytics</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-100">Health Trends & ML Benchmarks</h2>
          <p className="text-xs text-slate-400">Interactive visual diagnostics of patient dataset biomarkers and machine learning performances.</p>
        </div>
      </div>

      {/* Grid Row 1: Model Accuracy Comparison Chart & Age Group Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* ML Model Accuracy Comparison */}
        <div className="lg:col-span-7 glass-panel p-6 rounded-3xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-100 text-base flex items-center gap-2">
                <Cpu className="h-5 w-5 text-teal-400" />
                <span>ML Model Evaluation Benchmarks</span>
              </h3>
              <p className="text-xs text-slate-400">Comparison of Accuracy, F1 Score, and Precision across 5 ML algorithms</p>
            </div>
          </div>

          <div className="h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={models?.models || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="name" stroke="#94a3b8" tick={{ fontSize: 11 }} />
                <YAxis stroke="#94a3b8" domain={[60, 100]} tick={{ fontSize: 11 }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#f8fafc' }}
                />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Bar dataKey="accuracy" name="Accuracy %" fill="#2dd4bf" radius={[6, 6, 0, 0]} />
                <Bar dataKey="f1Score" name="F1 Score %" fill="#3b82f6" radius={[6, 6, 0, 0]} />
                <Bar dataKey="precision" name="Precision %" fill="#a855f7" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Age Group Distribution */}
        <div className="lg:col-span-5 glass-panel p-6 rounded-3xl space-y-4">
          <div>
            <h3 className="font-bold text-slate-100 text-base flex items-center gap-2">
              <PieIcon className="h-5 w-5 text-teal-400" />
              <span>Age Group Risk Distribution</span>
            </h3>
            <p className="text-xs text-slate-400">Diabetic (1) vs Non-Diabetic (0) prevalence by age bracket</p>
          </div>

          <div className="h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={trends?.ageGroupData || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="ageGroup" stroke="#94a3b8" tick={{ fontSize: 11 }} />
                <YAxis stroke="#94a3b8" tick={{ fontSize: 11 }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#f8fafc' }}
                />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Bar dataKey="NonDiabetic" name="Non-Diabetic" fill="#10b981" radius={[6, 6, 0, 0]} />
                <Bar dataKey="Diabetic" name="Diabetic" fill="#f43f5e" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Grid Row 2: Glucose vs BMI Scatter Plot & Feature Correlation Bar Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Glucose vs BMI Scatter Trajectory */}
        <div className="lg:col-span-7 glass-panel p-6 rounded-3xl space-y-4">
          <div>
            <h3 className="font-bold text-slate-100 text-base flex items-center gap-2">
              <Activity className="h-5 w-5 text-teal-400" />
              <span>Biomarker Trajectory: Plasma Glucose vs BMI</span>
            </h3>
            <p className="text-xs text-slate-400">Cluster separation showing higher glucose (&gt;140) &amp; BMI (&gt;30) outcome density</p>
          </div>

          <div className="h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis type="number" dataKey="glucose" name="Glucose" unit=" mg/dL" stroke="#94a3b8" domain={[50, 210]} tick={{ fontSize: 11 }} />
                <YAxis type="number" dataKey="bmi" name="BMI" stroke="#94a3b8" domain={[15, 55]} tick={{ fontSize: 11 }} />
                <Tooltip 
                  cursor={{ strokeDasharray: '3 3' }}
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#f8fafc' }}
                />
                <Scatter 
                  name="Patients" 
                  data={trends?.scatterData || []} 
                  fill="#2dd4bf"
                >
                  {(trends?.scatterData || []).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.outcome === 1 ? '#f43f5e' : '#10b981'} />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-center gap-6 text-xs text-slate-400 pt-2">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-emerald-500"></div>
              <span>Non-Diabetic Cluster</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-rose-500"></div>
              <span>Diabetic Risk Cluster</span>
            </div>
          </div>
        </div>

        {/* Feature Correlation with Outcome */}
        <div className="lg:col-span-5 glass-panel p-6 rounded-3xl space-y-4">
          <div>
            <h3 className="font-bold text-slate-100 text-base flex items-center gap-2">
              <Zap className="h-5 w-5 text-teal-400" />
              <span>Feature Impact on Diabetes Outcome</span>
            </h3>
            <p className="text-xs text-slate-400">Pearson correlation coefficient relative to target outcome</p>
          </div>

          <div className="space-y-3 pt-2">
            {trends?.featureCorrelations?.map((item) => (
              <div key={item.feature} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-slate-300">{item.feature}</span>
                  <span className="font-mono text-teal-400 font-bold">+{item.correlationWithOutcome}</span>
                </div>
                <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-teal-500 to-cyan-400 rounded-full"
                    style={{ width: `${Math.max(5, item.correlationWithOutcome * 150)}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
