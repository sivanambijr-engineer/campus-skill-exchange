import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';

export const VerifyProfile = () => {
  const { currentUser, refreshUser, showToast } = useApp();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    major: currentUser?.major || '',
    campusName: currentUser?.campusName || 'Stanford University',
    bio: currentUser?.bio || ''
  });

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.major || !formData.campusName) {
      showToast('Missing Info', 'Major and Campus are required.', 'error');
      return;
    }

    setLoading(true);
    try {
      await api.updateMyProfile({
        major: formData.major,
        campus_name: formData.campusName,
        bio: formData.bio
      });
      showToast('Profile Saved!', 'Welcome to Campus Skill Exchange.');
      await refreshUser();
    } catch (err) {
      showToast('Update Failed', 'Failed to save profile. Try again.', 'error');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center -m-8 p-4">
      <div className="glass-card max-w-lg w-full rounded-3xl p-8 border border-slate-800 space-y-6">

        <div className="text-center">
          <h2 className="font-display font-bold text-2xl text-white">Complete Your Profile</h2>
          <p className="text-slate-400 mt-2 text-sm">Just a few more details to get you started.</p>
        </div>

        <div className="flex items-center justify-center gap-4 py-2">
          <img
            src={currentUser?.avatarUrl}
            alt={currentUser?.fullName}
            className="w-16 h-16 rounded-2xl object-cover border-2 border-brand-500"
          />
          <div className="text-left">
            <p className="text-white font-bold">{currentUser?.fullName}</p>
            <p className="text-xs text-slate-400">{currentUser?.email}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Campus / University</label>
            <input
              type="text"
              name="campusName"
              value={formData.campusName}
              onChange={handleChange}
              className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand-500 transition-colors"
              placeholder="e.g. Stanford University"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Major / Degree</label>
            <input
              type="text"
              name="major"
              value={formData.major}
              onChange={handleChange}
              className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand-500 transition-colors"
              placeholder="e.g. Computer Science"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Short Bio</label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              rows="3"
              className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand-500 transition-colors resize-none"
              placeholder="Tell others what you love learning and teaching..."
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-brand-500 text-white font-bold text-sm hover:bg-brand-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-4"
          >
            {loading ? 'Saving...' : 'Complete Profile'}
          </button>
        </form>

      </div>
    </div>
  );
};
