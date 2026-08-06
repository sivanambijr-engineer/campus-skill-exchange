import React from 'react';
import { useApp } from '../context/AppContext';

export const Profile = () => {
  const { currentUser, reviews, setIsAddSkillModalOpen } = useApp();

  const userReviews = reviews.filter(r => r.revieweeId === currentUser.id);

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      
      {/* Profile Header Card */}
      <div className="glass-card rounded-3xl p-8 border border-slate-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 h-32 w-full bg-gradient-to-r from-brand-600/20 via-purple-600/20 to-accent-600/20 opacity-60"></div>
        
        <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start gap-6 pt-4">
          <img
            src={currentUser.avatarUrl}
            alt={currentUser.fullName}
            className="w-24 h-24 rounded-3xl object-cover border-4 border-slate-900 shadow-xl"
          />

          <div className="flex-1 text-center sm:text-left space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h1 className="font-display font-bold text-2xl text-white">{currentUser.fullName}</h1>
                <p className="text-xs text-brand-400 font-semibold">{currentUser.major} • {currentUser.campusName}</p>
              </div>

              {/* Karma & Rating Pill */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold self-center sm:self-auto">
                <span>⭐ {currentUser.reputationScore} Rating</span>
                <span>•</span>
                <span>⚡ {currentUser.karmaPoints} Karma</span>
              </div>
            </div>

            <p className="text-xs text-slate-300 max-w-xl leading-relaxed pt-1">
              "{currentUser.bio}"
            </p>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-800/80">
              <div className="text-center sm:text-left">
                <span className="block font-display font-bold text-lg text-white">{currentUser.swapsCompleted}</span>
                <span className="text-[11px] text-slate-400">Completed Swaps</span>
              </div>
              <div className="text-center sm:text-left">
                <span className="block font-display font-bold text-lg text-emerald-400">{currentUser.skillsOffered.length}</span>
                <span className="text-[11px] text-slate-400">Skills Offered</span>
              </div>
              <div className="text-center sm:text-left">
                <span className="block font-display font-bold text-lg text-brand-400">{currentUser.skillsDesired.length}</span>
                <span className="text-[11px] text-slate-400">Skills Desired</span>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Skills Management Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Skills Offered */}
        <div className="glass-card rounded-3xl p-6 border border-emerald-500/20 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-bold text-base text-white flex items-center gap-2">
              <span>🟢 Skills I Can Teach</span>
            </h3>
            <button
              onClick={() => setIsAddSkillModalOpen(true)}
              className="text-xs text-emerald-400 hover:underline font-semibold"
            >
              + Add
            </button>
          </div>

          <div className="space-y-3">
            {currentUser.skillsOffered.map(skill => (
              <div key={skill.id} className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-sm text-slate-100">{skill.name}</h4>
                  <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-emerald-500/20 text-emerald-300">
                    {skill.proficiency}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1">{skill.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Skills Desired */}
        <div className="glass-card rounded-3xl p-6 border border-brand-500/20 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-bold text-base text-white flex items-center gap-2">
              <span>🎯 Skills I Want to Learn</span>
            </h3>
            <button
              onClick={() => setIsAddSkillModalOpen(true)}
              className="text-xs text-brand-400 hover:underline font-semibold"
            >
              + Add
            </button>
          </div>

          <div className="space-y-3">
            {currentUser.skillsDesired.map(skill => (
              <div key={skill.id} className="p-3.5 rounded-2xl bg-brand-500/10 border border-brand-500/20">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-sm text-slate-100">{skill.name}</h4>
                  <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-brand-500/20 text-brand-300">
                    {skill.proficiency}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1">{skill.description}</p>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Reviews Received Feed */}
      <div className="glass-card rounded-3xl p-6 border border-slate-800 space-y-4">
        <h3 className="font-display font-bold text-lg text-white flex items-center gap-2">
          <span>⭐ Campus Reviews ({userReviews.length})</span>
        </h3>

        {userReviews.length > 0 ? (
          <div className="space-y-4">
            {userReviews.map(rev => (
              <div key={rev.id} className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img src={rev.reviewerAvatar} alt={rev.reviewerName} className="w-8 h-8 rounded-full object-cover" />
                    <span className="font-semibold text-xs text-white">{rev.reviewerName}</span>
                  </div>
                  <span className="text-amber-400 text-xs font-bold">{"★".repeat(rev.rating)} ({rev.rating}.0)</span>
                </div>
                <p className="text-xs text-slate-300 italic">"{rev.comment}"</p>
                <span className="text-[10px] text-slate-500 block text-right">{rev.date}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-400">No reviews received yet. Complete a swap to earn peer feedback!</p>
        )}
      </div>

    </div>
  );
};
