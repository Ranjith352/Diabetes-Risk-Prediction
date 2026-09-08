import React, { useEffect, useState } from 'react';
import { 
  History, 
  Search, 
  Download, 
  Trash2, 
  Eye, 
  X, 
  Filter, 
  Calendar, 
  Activity,
  CheckCircle2
} from 'lucide-react';
import { fetchPredictionHistory, deleteHistoryItem } from '../api';

export default function PredictionHistory() {
  const [history, setHistory] = useState([]);
  const [search, setSearch] = useState('');
  const [filterLevel, setFilterLevel] = useState('All');
  const [selectedItem, setSelectedItem] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadHistory = async () => {
    setLoading(true);
    try {
      const data = await fetchPredictionHistory();
      setHistory(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this record?")) {
      await deleteHistoryItem(id);
      setHistory(prev => prev.filter(item => item.id !== id));
      if (selectedItem?.id === id) setSelectedItem(null);
    }
  };

  const handleExportCSV = () => {
    if (history.length === 0) return;
    const headers = ["ID,Patient Name,Age,Gender,Glucose,Blood Pressure,BMI,Insulin,Model Used,Risk Level,Risk Score,Date\n"];
    const rows = history.map(r => 
      `${r.id},"${r.patientName}",${r.age},${r.gender},${r.glucose},${r.bloodPressure},${r.bmi},${r.insulin},"${r.modelUsed}","${r.riskLevel}",${r.riskScore},"${r.createdAt}"`
    );
    const blob = new Blob([...headers, rows.join("\n")], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Diabetes_Prediction_History_${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
  };

  const filteredHistory = history.filter(item => {
    const matchesSearch = item.patientName?.toLowerCase().includes(search.toLowerCase()) ||
                          item.modelUsed?.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filterLevel === 'All' || item.riskLevel === filterLevel;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-8 pb-12">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-panel p-6 rounded-3xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-semibold text-teal-400 uppercase tracking-wider">
            <History className="h-4 w-4" />
            <span>Database Records</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-100">Prediction History</h2>
          <p className="text-xs text-slate-400">Searchable clinical log of all previous machine learning inferences.</p>
        </div>

        <button
          onClick={handleExportCSV}
          className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 flex items-center gap-2 transition-colors self-start md:self-auto"
        >
          <Download className="h-4 w-4 text-teal-400" />
          <span>Export CSV</span>
        </button>
      </div>

      {/* Controls Bar: Search & Filter Pills */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Filter by patient name or model..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-900 text-sm text-slate-200 placeholder-slate-400 rounded-xl border border-slate-800 focus:outline-none focus:border-teal-500"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          {['All', 'High Risk', 'Moderate Risk', 'Low Risk'].map((level) => (
            <button
              key={level}
              onClick={() => setFilterLevel(level)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                filterLevel === level
                  ? 'bg-teal-500/10 text-teal-400 border border-teal-500/40 shadow-sm'
                  : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200'
              }`}
            >
              {level}
            </button>
          ))}
        </div>
      </div>

      {/* Main Table */}
      <div className="glass-panel rounded-3xl overflow-hidden border border-slate-800">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-slate-950/60 border-b border-slate-800 text-xs text-slate-400 font-semibold uppercase">
                <th className="py-4 px-5">Patient Name</th>
                <th className="py-4 px-5">Age / Gender</th>
                <th className="py-4 px-5">Glucose</th>
                <th className="py-4 px-5">BP</th>
                <th className="py-4 px-5">BMI</th>
                <th className="py-4 px-5">Model</th>
                <th className="py-4 px-5">Risk Level</th>
                <th className="py-4 px-5">Score</th>
                <th className="py-4 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {loading ? (
                <tr>
                  <td colSpan="9" className="py-8 text-center text-slate-400 text-xs">
                    Loading records from database...
                  </td>
                </tr>
              ) : filteredHistory.length === 0 ? (
                <tr>
                  <td colSpan="9" className="py-8 text-center text-slate-400 text-xs">
                    No prediction records found matching filters.
                  </td>
                </tr>
              ) : (
                filteredHistory.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-4 px-5 font-bold text-slate-200">{row.patientName}</td>
                    <td className="py-4 px-5 text-slate-400 text-xs">{row.age} yrs • {row.gender}</td>
                    <td className="py-4 px-5 font-semibold text-slate-300">{row.glucose} mg/dL</td>
                    <td className="py-4 px-5 text-slate-400 text-xs">{row.bloodPressure} mm Hg</td>
                    <td className="py-4 px-5 text-slate-300 font-medium">{row.bmi}</td>
                    <td className="py-4 px-5 text-xs text-teal-400">{row.modelUsed}</td>
                    <td className="py-4 px-5">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                        row.riskLevel === 'High Risk'
                          ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                          : row.riskLevel === 'Moderate Risk'
                          ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                          : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      }`}>
                        {row.riskLevel}
                      </span>
                    </td>
                    <td className="py-4 px-5 font-bold text-slate-200">{row.riskScore}%</td>
                    <td className="py-4 px-5 text-right space-x-2">
                      <button
                        onClick={() => setSelectedItem(row)}
                        title="View Full Details"
                        className="p-1.5 text-slate-400 hover:text-teal-400 hover:bg-teal-500/10 rounded-lg transition-colors"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(row.id)}
                        title="Delete Record"
                        className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Patient Detail Modal */}
      {selectedItem && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glass-panel w-full max-w-lg rounded-3xl p-6 space-y-6 border border-slate-700 shadow-2xl relative animate-in zoom-in-95 duration-200">
            <button
              onClick={() => setSelectedItem(null)}
              className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-xl"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="space-y-1">
              <span className="text-xs font-semibold text-teal-400 uppercase tracking-wider">Patient Inspection</span>
              <h3 className="text-2xl font-bold text-slate-100">{selectedItem.patientName}</h3>
              <p className="text-xs text-slate-400">{selectedItem.age} Years Old • {selectedItem.gender} • {selectedItem.createdAt}</p>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                <span className="text-slate-400">Glucose Level</span>
                <p className="text-base font-bold text-slate-100">{selectedItem.glucose} mg/dL</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                <span className="text-slate-400">Body Mass Index</span>
                <p className="text-base font-bold text-slate-100">{selectedItem.bmi}</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                <span className="text-slate-400">Blood Pressure</span>
                <p className="text-base font-bold text-slate-100">{selectedItem.bloodPressure} mm Hg</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                <span className="text-slate-400">2-Hr Insulin</span>
                <p className="text-base font-bold text-slate-100">{selectedItem.insulin} mu U/ml</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-400">Evaluated Risk Score</span>
                <p className="text-xl font-extrabold text-teal-400">{selectedItem.riskScore}% Probability</p>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-teal-500/20 text-teal-300">
                {selectedItem.riskLevel}
              </span>
            </div>

            <button
              onClick={() => setSelectedItem(null)}
              className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl"
            >
              Close Details
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
