import React from 'react';
import { useApp } from '../context/AppContext';

export const SkillCard = ({ user }) => {
  const { setSwapModalTarget, setActiveTab, calculateAIMatchScore } = useApp();

  const matchScore = calculateAIMatchScore(user);

  const primaryOffered =
    user.skillsOffered[0] || {
      name: 'General Tutoring',
      category: 'Academics',
      proficiency: 'Advanced'
    };

  const primaryDesired =
    user.skillsDesired[0] || {
      name: 'Any Skill',
      category: 'General',
      proficiency: 'Beginner'
    };

  return (
    <div className="glass-card glass-card-hover rounded-2xl p-5 flex flex-col justify-between border border-slate-800 relative group overflow-hidden">

      {/* Gradient Top Border */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-brand-500 via-purple-500 to-accent-500 opacity-80 group-hover:opacity-100 transition-opacity"></div>

      <div>

        {/* User Header */}
        <div className="flex items-start justify-between gap-3 mb-4">

          <div className="flex items-center gap-3">

            <img
              src={user.avatarUrl}
              alt={user.fullName}
              className="w-12 h-12 rounded-2xl object-cover border border-slate-700 shadow-md"
            />

            <div>

              <h3 className="font-display font-semibold text-base text-white group-hover:text-brand-300 transition-colors">
                {user.fullName}
              </h3>

              <p className="text-xs text-slate-400 font-medium">
                {user.major}
              </p>

              <p className="text-xs text-slate-500">
                📍 {user.campusName}
              </p>

              <div className="flex items-center gap-2 mt-1 text-xs text-amber-400">
                <span>⭐ {user.reputationScore}</span>
                <span className="text-slate-600">•</span>
                <span className="text-slate-400">
                  {user.swapsCompleted} swaps
                </span>
              </div>

            </div>
          </div>

          {/* AI Badge */}
          <div className="flex flex-col items-end">

            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-purple-500/20 text-purple-300 border border-purple-500/40 shadow-sm">
              🤖 AI Match {matchScore}%
            </span>

            <span className="text-[10px] text-slate-500 mt-1">
              ✔ Verified Student
            </span>

          </div>

        </div>

        {/* Bio */}
        {user.bio && (
          <p className="text-xs text-slate-300 mb-4 bg-slate-950/40 p-3 rounded-xl border border-slate-800/60 line-clamp-2">
            {user.bio}
          </p>
        )}

        {/* Skills */}

        <div className="space-y-3 mb-5">

          {/* Can Teach */}

          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">

            <div className="flex items-center justify-between mb-1">

              <span className="text-xs font-semibold text-emerald-400">
                🚀 Can Teach
              </span>

              <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-[10px] uppercase font-bold">
                {primaryOffered.proficiency}
              </span>

            </div>

            <p className="font-medium text-sm text-slate-100">
              {primaryOffered.name}
            </p>

            {primaryOffered.description && (
              <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                {primaryOffered.description}
              </p>
            )}

            {user.skillsOffered.length > 1 && (
              <p className="text-[11px] text-emerald-300 mt-2">
                + {user.skillsOffered.length - 1} more skill(s)
              </p>
            )}

          </div>

          {/* Wants To Learn */}

          <div className="p-3 rounded-xl bg-brand-500/10 border border-brand-500/20">

            <div className="flex items-center justify-between mb-1">

              <span className="text-xs font-semibold text-brand-400">
                📚 Wants to Learn
              </span>

              <span className="px-2 py-0.5 rounded bg-brand-500/20 text-[10px] uppercase font-bold">
                {primaryDesired.proficiency}
              </span>

            </div>

            <p className="font-medium text-sm text-slate-100">
              {primaryDesired.name}
            </p>

          </div>

        </div>

      </div>

      {/* Footer */}

      <div className="flex gap-2 pt-3 border-t border-slate-800">

        <button
          onClick={() =>
            setSwapModalTarget({
              user,
              skill: primaryOffered
            })
          }
          className="flex-1 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 transition-all text-white text-xs font-semibold shadow-lg shadow-brand-600/20"
        >
          🤝 Request Skill Swap
        </button>

        <button
          onClick={() => setActiveTab('chat')}
          className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white transition-all text-xs font-medium"
        >
          💬 Chat
        </button>

      </div>

    </div>
  );
};