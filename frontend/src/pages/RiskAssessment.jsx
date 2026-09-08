import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Activity, 
  Sparkles, 
  AlertCircle, 
  CheckCircle2, 
  ShieldAlert, 
  FileText, 
  RefreshCw, 
  Sliders,
  ChevronRight,
  Info
} from 'lucide-react';
import { predictDiabetesRisk } from '../api';

export default function RiskAssessment() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: 'Eleanor Vance',
    age: 35,
    gender: 'Female',
    pregnancies: 2,
    glucose: 145,
    bloodPressure: 76,
    skinThickness: 28,
    insulin: 120,
    bmi: 31.5,
    dpf: 0.52,
    model: 'Random Forest'
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const data = await predictDiabetesRisk(formData);
      setResult(data);
    } catch (err) {
      setError('Failed to compute risk prediction. Please ensure backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setFormData({
      name: '',
      age: 30,
      gender: 'Female',
      pregnancies: 1,
      glucose: 100,
      bloodPressure: 70,
      skinThickness: 20,
      insulin: 80,
      bmi: 24.5,
      dpf: 0.35,
      model: 'Random Forest'
    });
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-panel p-6 rounded-3xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-semibold text-teal-400 uppercase tracking-wider">
            <Activity className="h-4 w-4" />
            <span>Interactive Diagnostic Console</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-100">Diabetes Risk Assessment</h2>
          <p className="text-xs text-slate-400">Input clinical biomarkers to calculate real-time machine learning prediction probability.</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleReset}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>Reset Inputs</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Form Inputs */}
        <div className="lg:col-span-7 glass-panel rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <h3 className="font-bold text-slate-100 text-lg flex items-center gap-2">
              <Sliders className="h-5 w-5 text-teal-400" />
              <span>Patient Parameters</span>
            </h3>
            <span className="text-xs text-slate-400">Pima Indians Standard Inputs</span>
          </div>

          {error && (
            <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Patient General Info */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Patient Full Name</label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Jane Doe"
                  className="w-full px-3.5 py-2.5 bg-slate-950/80 text-sm text-slate-200 placeholder-slate-400 rounded-xl border border-slate-700/60 focus:outline-none focus:border-teal-500 transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Age (Years)</label>
                <input
                  type="number"
                  name="age"
                  min="1"
                  max="110"
                  required
                  value={formData.age}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 bg-slate-950/80 text-sm text-slate-200 rounded-xl border border-slate-700/60 focus:outline-none focus:border-teal-500 transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Gender</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 bg-slate-950/80 text-sm text-slate-200 rounded-xl border border-slate-700/60 focus:outline-none focus:border-teal-500 transition-all"
                >
                  <option value="Female">Female</option>
                  <option value="Male">Male</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            {/* Biomarker Sliders & Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
              
              {/* Glucose */}
              <div className="space-y-2 p-3.5 rounded-2xl bg-slate-950/40 border border-slate-800">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-200">Plasma Glucose (mg/dL)</span>
                  <span className="font-bold text-teal-400">{formData.glucose}</span>
                </div>
                <input
                  type="range"
                  name="glucose"
                  min="50"
                  max="250"
                  value={formData.glucose}
                  onChange={handleChange}
                  className="w-full accent-teal-400 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>70 Normal</span>
                  <span>140 Elevated</span>
                  <span>200 High</span>
                </div>
              </div>

              {/* BMI */}
              <div className="space-y-2 p-3.5 rounded-2xl bg-slate-950/40 border border-slate-800">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-200">Body Mass Index (BMI)</span>
                  <span className="font-bold text-teal-400">{formData.bmi}</span>
                </div>
                <input
                  type="range"
                  name="bmi"
                  min="15.0"
                  max="55.0"
                  step="0.1"
                  value={formData.bmi}
                  onChange={handleChange}
                  className="w-full accent-teal-400 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>18.5 Normal</span>
                  <span>25.0 Overweight</span>
                  <span>30.0 Obese</span>
                </div>
              </div>

              {/* Blood Pressure */}
              <div className="space-y-2 p-3.5 rounded-2xl bg-slate-950/40 border border-slate-800">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-200">Blood Pressure (mm Hg)</span>
                  <span className="font-bold text-teal-400">{formData.bloodPressure}</span>
                </div>
                <input
                  type="range"
                  name="bloodPressure"
                  min="40"
                  max="140"
                  value={formData.bloodPressure}
                  onChange={handleChange}
                  className="w-full accent-teal-400 cursor-pointer"
                />
              </div>

              {/* Insulin */}
              <div className="space-y-2 p-3.5 rounded-2xl bg-slate-950/40 border border-slate-800">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-200">2-Hour Insulin (mu U/ml)</span>
                  <span className="font-bold text-teal-400">{formData.insulin}</span>
                </div>
                <input
                  type="range"
                  name="insulin"
                  min="0"
                  max="400"
                  value={formData.insulin}
                  onChange={handleChange}
                  className="w-full accent-teal-400 cursor-pointer"
                />
              </div>

              {/* Pregnancies */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Pregnancies</label>
                <input
                  type="number"
                  name="pregnancies"
                  min="0"
                  max="20"
                  value={formData.pregnancies}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 bg-slate-950/80 text-sm text-slate-200 rounded-xl border border-slate-700/60 focus:outline-none focus:border-teal-500"
                />
              </div>

              {/* DPF */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Diabetes Pedigree Function</label>
                <input
                  type="number"
                  step="0.01"
                  name="dpf"
                  min="0.0"
                  max="2.5"
                  value={formData.dpf}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 bg-slate-950/80 text-sm text-slate-200 rounded-xl border border-slate-700/60 focus:outline-none focus:border-teal-500"
                />
              </div>

              {/* Skin Thickness */}
              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs font-semibold text-slate-300">Skin Thickness (mm)</label>
                <input
                  type="number"
                  name="skinThickness"
                  min="0"
                  max="99"
                  value={formData.skinThickness}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 bg-slate-950/80 text-sm text-slate-200 rounded-xl border border-slate-700/60 focus:outline-none focus:border-teal-500"
                />
              </div>

            </div>

            {/* Model Selection Dropdown */}
            <div className="pt-2 space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-teal-400" />
                <span>Select Machine Learning Algorithm</span>
              </label>
              <select
                name="model"
                value={formData.model}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-slate-950 text-sm font-semibold text-teal-300 rounded-xl border border-teal-500/40 focus:outline-none focus:border-teal-400 transition-all"
              >
                <option value="Random Forest">Random Forest Classifier (Recommended - ~88% Acc)</option>
                <option value="Naive Bayes">Gaussian Naive Bayes (~84% Acc)</option>
                <option value="Decision Tree">Decision Tree Classifier (~79% Acc)</option>
                <option value="Boosting">AdaBoost Classifier (~86% Acc)</option>
                <option value="Bagging">Bagging Classifier (~85% Acc)</option>
              </select>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 px-6 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-slate-950 font-extrabold rounded-2xl shadow-xl shadow-teal-500/25 flex items-center justify-center gap-2 transition-all active:scale-[0.99] disabled:opacity-50"
            >
              {loading ? (
                <span>Training & Evaluating Model...</span>
              ) : (
                <>
                  <Activity className="h-5 w-5 stroke-[2.5]" />
                  <span>Execute Diabetes Risk Inference</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Column: Prediction Result Display Card */}
        <div className="lg:col-span-5 space-y-6">
          {result ? (
            <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-teal-500/30 space-y-6 animate-in fade-in duration-300">
              
              {/* Risk Level Badge */}
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Inference Output</span>
                <span className={`px-3.5 py-1.5 rounded-full text-xs font-bold ${
                  result.riskLevel === 'High Risk'
                    ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                    : result.riskLevel === 'Moderate Risk'
                    ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                    : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                }`}>
                  {result.riskLevel}
                </span>
              </div>

              {/* Patient Name & Result Text */}
              <div className="space-y-1">
                <h4 className="text-2xl font-bold text-slate-100">{result.patientName}</h4>
                <p className="text-sm font-semibold text-teal-400">{result.resultText}</p>
              </div>

              {/* Risk Score Dial Meter */}
              <div className="p-6 rounded-2xl bg-slate-950/60 border border-slate-800 text-center space-y-3">
                <span className="text-xs text-slate-400 font-semibold uppercase">Risk Probability Score</span>
                <div className="text-5xl font-black text-slate-100">
                  {result.riskScore}%
                </div>
                
                {/* Progress bar */}
                <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-700 ${
                      result.riskScore > 65
                        ? 'bg-gradient-to-r from-amber-500 to-rose-500'
                        : result.riskScore > 35
                        ? 'bg-gradient-to-r from-teal-500 to-amber-500'
                        : 'bg-gradient-to-r from-emerald-500 to-teal-400'
                    }`}
                    style={{ width: `${result.riskScore}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-[11px] text-slate-400 font-mono">
                  <span>0% Low</span>
                  <span>50% Moderate</span>
                  <span>100% High</span>
                </div>
              </div>

              {/* Model Specs */}
              <div className="flex items-center justify-between text-xs py-2 border-y border-slate-800/80 text-slate-400">
                <span>Model Engine: <strong className="text-slate-200">{result.modelUsed}</strong></span>
                <span>Evaluated: <strong className="text-slate-200">{result.createdAt?.split(' ')[1] || 'Just now'}</strong></span>
              </div>

              {/* Clinical Recommendations */}
              <div className="space-y-3">
                <h5 className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Info className="h-4 w-4 text-teal-400" />
                  <span>Clinical Recommendations</span>
                </h5>
                <ul className="space-y-2">
                  {result.recommendations?.map((rec, i) => (
                    <li key={i} className="text-xs text-slate-300 p-2.5 rounded-xl bg-slate-800/50 border border-slate-700/40 flex items-start gap-2.5">
                      <CheckCircle2 className="h-4 w-4 text-teal-400 shrink-0 mt-0.5" />
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex gap-3">
                <button
                  onClick={() => navigate('/dashboard/reports')}
                  className="flex-1 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 flex items-center justify-center gap-2 transition-colors"
                >
                  <FileText className="h-4 w-4 text-teal-400" />
                  <span>Generate Report</span>
                </button>
              </div>

            </div>
          ) : (
            <div className="glass-panel p-8 rounded-3xl text-center space-y-4 border border-dashed border-slate-800">
              <div className="h-14 w-14 rounded-2xl bg-teal-500/10 text-teal-400 mx-auto flex items-center justify-center">
                <Activity className="h-7 w-7" />
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-slate-200 text-base">Awaiting Inference</h4>
                <p className="text-xs text-slate-400 max-w-xs mx-auto">
                  Fill in patient clinical parameters on the left and click "Execute Diabetes Risk Inference".
                </p>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
