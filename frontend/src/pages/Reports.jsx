import React, { useState } from 'react';
import { 
  FileText, 
  Printer, 
  Download, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldCheck, 
  Activity,
  UserCheck
} from 'lucide-react';

export default function Reports() {
  const [reportData, setReportData] = useState({
    patientName: 'Eleanor Vance',
    age: 45,
    gender: 'Female',
    glucose: 158,
    bloodPressure: 78,
    bmi: 34.2,
    insulin: 175,
    dpf: 0.627,
    riskLevel: 'High Risk',
    riskScore: 82.5,
    modelUsed: 'Random Forest Ensemble',
    date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Printable CSS style snippet */}
      <style>{`
        @media print {
          body { background: #ffffff !important; color: #000000 !important; }
          aside, header, button { display: none !important; }
          .printable-report { border: none !important; background: #ffffff !important; color: #000000 !important; box-shadow: none !important; padding: 0 !important; }
          .printable-text { color: #000000 !important; }
          .printable-bg { background: #f8fafc !important; border: 1px solid #e2e8f0 !important; }
        }
      `}</style>

      {/* Control Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-panel p-6 rounded-3xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-semibold text-teal-400 uppercase tracking-wider">
            <FileText className="h-4 w-4" />
            <span>Clinical Summary Engine</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-100">Medical Risk Report Generator</h2>
          <p className="text-xs text-slate-400">Generate standardized, printable clinical evaluation reports for patients and endocrinologists.</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handlePrint}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-slate-950 font-bold text-xs shadow-lg shadow-teal-500/20 flex items-center gap-2 transition-all"
          >
            <Printer className="h-4 w-4 stroke-[2.5]" />
            <span>Print Report</span>
          </button>
        </div>
      </div>

      {/* Main Printable Document Card */}
      <div className="printable-report glass-panel p-8 sm:p-12 rounded-3xl border border-slate-800 space-y-8 max-w-4xl mx-auto shadow-2xl">
        
        {/* Document Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-6">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-teal-500 to-cyan-500 flex items-center justify-center shadow-md">
              <Activity className="h-7 w-7 text-slate-950 stroke-[2.5]" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-100 printable-text">GlucoRisk Diagnostic Report</h1>
              <p className="text-xs text-slate-400">Pima Indians Machine Learning Risk Protocol</p>
            </div>
          </div>

          <div className="text-right text-xs text-slate-400">
            <p className="font-semibold text-slate-200 printable-text">Report ID: GR-2026-8891</p>
            <p>Generated: {reportData.date}</p>
          </div>
        </div>

        {/* Patient & Model Info Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 rounded-2xl bg-slate-950/60 printable-bg">
          <div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase">Patient Name</span>
            <p className="text-sm font-bold text-slate-100 printable-text">{reportData.patientName}</p>
          </div>
          <div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase">Age / Gender</span>
            <p className="text-sm font-semibold text-slate-200 printable-text">{reportData.age} Yrs • {reportData.gender}</p>
          </div>
          <div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase">ML Model Engine</span>
            <p className="text-sm font-semibold text-teal-400">{reportData.modelUsed}</p>
          </div>
          <div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase">Evaluation Status</span>
            <p className="text-sm font-bold text-rose-400">{reportData.riskLevel} ({reportData.riskScore}%)</p>
          </div>
        </div>

        {/* Clinical Biomarkers Table */}
        <div className="space-y-3">
          <h3 className="font-bold text-slate-200 text-sm uppercase tracking-wider printable-text">1. Patient Clinical Biomarkers</h3>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border border-slate-800 rounded-xl overflow-hidden">
              <thead className="bg-slate-950/80 text-slate-400 font-semibold uppercase">
                <tr>
                  <th className="p-3">Parameter</th>
                  <th className="p-3">Measured Value</th>
                  <th className="p-3">Clinical Benchmark</th>
                  <th className="p-3">Evaluation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                <tr>
                  <td className="p-3 font-semibold">Plasma Glucose</td>
                  <td className="p-3 font-bold text-slate-100">{reportData.glucose} mg/dL</td>
                  <td className="p-3 text-slate-400">70 - 140 mg/dL</td>
                  <td className="p-3 font-bold text-rose-400">Elevated (&gt;140)</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold">Body Mass Index (BMI)</td>
                  <td className="p-3 font-bold text-slate-100">{reportData.bmi}</td>
                  <td className="p-3 text-slate-400">18.5 - 24.9</td>
                  <td className="p-3 font-bold text-rose-400">Class I Obesity (&gt;30)</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold">Blood Pressure</td>
                  <td className="p-3 font-bold text-slate-100">{reportData.bloodPressure} mm Hg</td>
                  <td className="p-3 text-slate-400">&lt;80 mm Hg</td>
                  <td className="p-3 text-emerald-400 font-semibold">Normal</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold">2-Hour Serum Insulin</td>
                  <td className="p-3 font-bold text-slate-100">{reportData.insulin} mu U/ml</td>
                  <td className="p-3 text-slate-400">16 - 166 mu U/ml</td>
                  <td className="p-3 text-amber-400 font-semibold">Slightly High</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold">Diabetes Pedigree Function</td>
                  <td className="p-3 font-bold text-slate-100">{reportData.dpf}</td>
                  <td className="p-3 text-slate-400">0.05 - 2.50</td>
                  <td className="p-3 text-slate-300">Moderate Hereditary Link</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* ML Inference Assessment Summary */}
        <div className="p-5 rounded-2xl bg-rose-500/10 border border-rose-500/20 space-y-2">
          <h4 className="font-bold text-rose-400 text-sm flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            <span>2. Diagnostic Conclusion: High Diabetes Risk Detected</span>
          </h4>
          <p className="text-xs text-slate-300 leading-relaxed">
            The trained Machine Learning Ensemble (Random Forest) evaluated this patient profile with an <strong className="text-rose-400">82.5% probability</strong> of Type-2 Diabetes susceptibility. Primary drivers are fasting plasma glucose level (158 mg/dL) combined with elevated Body Mass Index (34.2).
          </p>
        </div>

        {/* Preventive Action Plan */}
        <div className="space-y-3">
          <h3 className="font-bold text-slate-200 text-sm uppercase tracking-wider printable-text">3. Recommended Clinical Action Plan</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 printable-bg space-y-1">
              <span className="font-semibold text-teal-400 flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4" /> Fasting Glycemic Evaluation
              </span>
              <p className="text-slate-300">Schedule HbA1c blood test to confirm average blood sugar levels over the past 3 months.</p>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 printable-bg space-y-1">
              <span className="font-semibold text-teal-400 flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4" /> Dietary & Physical Intervention
              </span>
              <p className="text-slate-300">Target 5-7% weight reduction with low-glycemic dietary planning and 150 mins weekly exercise.</p>
            </div>
          </div>
        </div>

        {/* Signature Line */}
        <div className="pt-8 border-t border-slate-800 flex justify-between items-end text-xs text-slate-400">
          <div>
            <p className="font-semibold text-slate-300 printable-text">Attending Specialist Signature:</p>
            <div className="h-10 border-b border-slate-700 w-48 mt-2"></div>
            <p className="pt-1 text-[11px]">Dr. Sarah Jenkins, M.D. (Endocrinology)</p>
          </div>
          <div className="text-right">
            <ShieldCheck className="h-6 w-6 text-teal-400 ml-auto mb-1" />
            <p className="text-[10px] text-slate-400">Verified by GlucoRisk ML Engine v2.4</p>
          </div>
        </div>

      </div>
    </div>
  );
}
