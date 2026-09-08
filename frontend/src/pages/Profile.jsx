import React, { useState, useEffect } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  ShieldCheck, 
  Save, 
  Heart, 
  Building, 
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { fetchUserProfile, updateUserProfile } from '../api';

export default function Profile() {
  const [profile, setProfile] = useState({
    name: 'Dr. Sarah Jenkins',
    email: 'sarah.jenkins@health.org',
    age: 38,
    gender: 'Female',
    mobile: '+1 (555) 234-5678',
    location: 'New York Medical Center, USA',
    bloodGroup: 'O+',
    medicalHistory: 'Family history of Type-2 Diabetes'
  });

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    async function loadProfile() {
      try {
        const data = await fetchUserProfile();
        setProfile(data);
      } catch (err) {
        console.error(err);
      }
    }
    loadProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');

    try {
      await updateUserProfile(profile);
      setMessage('Profile updated successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage('Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-panel p-6 rounded-3xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-semibold text-teal-400 uppercase tracking-wider">
            <User className="h-4 w-4" />
            <span>Account Management</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-100">User & Practitioner Profile</h2>
          <p className="text-xs text-slate-400">Manage medical practitioner credentials, contact details, and clinical preferences.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Avatar & Overview */}
        <div className="lg:col-span-4 glass-panel p-6 sm:p-8 rounded-3xl text-center space-y-6">
          <div className="relative inline-block">
            <img
              src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=300&auto=format&fit=crop"
              alt="Profile Avatar"
              className="h-28 w-28 rounded-full object-cover border-2 border-teal-500/40 shadow-xl mx-auto"
            />
            <span className="absolute bottom-1 right-1 h-4 w-4 rounded-full bg-emerald-400 border-2 border-slate-900" title="Active Specialist"></span>
          </div>

          <div className="space-y-1">
            <h3 className="text-xl font-bold text-slate-100">{profile.name}</h3>
            <p className="text-xs text-teal-400 font-semibold">Endocrinology Specialist</p>
            <p className="text-xs text-slate-400">{profile.email}</p>
          </div>

          <div className="pt-4 border-t border-slate-800 space-y-3 text-xs text-left">
            <div className="flex items-center gap-3 text-slate-300">
              <Building className="h-4 w-4 text-teal-400 shrink-0" />
              <span>{profile.location}</span>
            </div>
            <div className="flex items-center gap-3 text-slate-300">
              <Phone className="h-4 w-4 text-teal-400 shrink-0" />
              <span>{profile.mobile}</span>
            </div>
            <div className="flex items-center gap-3 text-slate-300">
              <Heart className="h-4 w-4 text-rose-400 shrink-0" />
              <span>Blood Group: <strong className="text-slate-100">{profile.bloodGroup}</strong></span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-teal-500/10 border border-teal-500/20 text-xs text-teal-300 space-y-1">
            <div className="font-semibold text-teal-400 flex items-center justify-center gap-1.5">
              <ShieldCheck className="h-4 w-4" /> HIPAA Certified Practitioner
            </div>
            <p className="text-[11px] text-slate-300">Access granted to AI clinical risk inferences and report exports.</p>
          </div>
        </div>

        {/* Right Column: Editable Profile Form */}
        <div className="lg:col-span-8 glass-panel p-6 sm:p-8 rounded-3xl space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <h3 className="font-bold text-slate-100 text-lg">Edit Personal & Professional Details</h3>
            {message && (
              <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="h-4 w-4" /> {message}
              </span>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={profile.name}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 bg-slate-950/80 text-sm text-slate-200 rounded-xl border border-slate-700/60 focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={profile.email}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 bg-slate-950/80 text-sm text-slate-200 rounded-xl border border-slate-700/60 focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Mobile Phone</label>
                <input
                  type="text"
                  name="mobile"
                  value={profile.mobile}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 bg-slate-950/80 text-sm text-slate-200 rounded-xl border border-slate-700/60 focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Age</label>
                <input
                  type="number"
                  name="age"
                  value={profile.age}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 bg-slate-950/80 text-sm text-slate-200 rounded-xl border border-slate-700/60 focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Hospital / Location</label>
                <input
                  type="text"
                  name="location"
                  value={profile.location}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 bg-slate-950/80 text-sm text-slate-200 rounded-xl border border-slate-700/60 focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Blood Group</label>
                <input
                  type="text"
                  name="bloodGroup"
                  value={profile.bloodGroup}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 bg-slate-950/80 text-sm text-slate-200 rounded-xl border border-slate-700/60 focus:outline-none focus:border-teal-500"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Medical Notes / Predisposition History</label>
              <textarea
                name="medicalHistory"
                rows="3"
                value={profile.medicalHistory}
                onChange={handleChange}
                className="w-full p-3.5 bg-slate-950/80 text-sm text-slate-200 rounded-xl border border-slate-700/60 focus:outline-none focus:border-teal-500"
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="px-6 py-3 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-teal-500/20 flex items-center gap-2 transition-all"
            >
              <Save className="h-4 w-4 stroke-[2.5]" />
              <span>{saving ? 'Saving Changes...' : 'Save Profile Changes'}</span>
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
