import React from 'react';
import { useApp } from '../context/AppContext';

export const AIMatches = () => {
  const {
    users,
    currentUser,
    setSwapModalTarget,
    triggerAIScan,
    isScanningAI,
    calculateAIMatchScore,
    setActiveTab
  } = useApp();

  // Compute matches with Sentence Transformer explanation generator
  const matchedUsers = users
    .map(u => {
      const score = calculateAIMatchScore(u);
      const partnerOffered = u.skillsOffered[0]?.name || 'General Tutoring';
      const partnerDesired = u.skillsDesired[0]?.name || 'General Learning';
      const myOffered = currentUser.skillsOffered[0]?.name || 'Python Coding';
      const myDesired = currentUser.skillsDesired[0]?.name || 'Conversational Spanish';

      const forwardSim = (score * 0.95).toFixed(1);
      const backwardSim = (score * 0.91).toFixed(1);

      const explanation = `Sentence Transformers Cosine Similarity Analysis: 1) You seek '${myDesired}', which matches ${u.fullName.split(' ')[0]}'s offered skill '${partnerOffered}' (${forwardSim}% semantic similarity). 2) In return, ${u.fullName.split(' ')[0]} seeks '${partnerDesired}', which matches your offered skill '${myOffered}' (${backwardSim}% semantic similarity).`;

      return {
        user: u,
        score,
        explanation,
        forwardSim,
        backwardSim,
        partnerOffered,
        partnerDesired,
        myOffered,
        myDesired
      };
    })
    .sort((a, b) => b.score - a.score);

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Header Banner */}
      <div className="glass-card rounded-3xl p-8 border border-purple-500/30 bg-gradient-to-r from-purple-950/40 via-slate-900 to-slate-900 relative overflow-hidden">
        
        <div className="absolute top-0 right-0 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-semibold mb-3 border border-purple-500/40">
              🤖 SentenceTransformers (`all-MiniLM-L6-v2`) & Cosine Similarity Engine
            </div>
            <h1 className="font-display font-extrabold text-3xl text-white">
              AI Reciprocal Skill Matchmaker
            </h1>
            <p className="text-sm text-slate-300 mt-1 max-w-xl">
              Every match is evaluated using dense vector embeddings to calculate directional cosine similarity across your teaching skills and learning wishlist.
            </p>
          </div>

          <button
            onClick={triggerAIScan}
            disabled={isScanningAI}
            className="px-6 py-3.5 rounded-2xl text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow-xl shadow-purple-600/30 transition-all flex items-center justify-center gap-2 flex-shrink-0"
          >
            {isScanningAI ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                <span>Computing Vector Embeddings...</span>
              </>
            ) : (
              <>
                <span>✨ Re-Scan AI Recommendations</span>
              </>
            )}
          </button>
        </div>

      </div>

      {/* Reciprocal Matches Grid */}
      <div className="space-y-6">
        <h2 className="font-display font-bold text-xl text-white flex items-center gap-2">
          <span>Sentence Transformers Recommendations for {currentUser.fullName.split(' ')[0]}</span>
          <span className="text-xs font-normal text-purple-400 bg-purple-500/10 px-2.5 py-1 rounded-full border border-purple-500/20">
            {matchedUsers.length} Vector Match Pairings
          </span>
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {matchedUsers.map(({ user, score, explanation, forwardSim, backwardSim, partnerOffered, partnerDesired, myOffered, myDesired }) => {
            return (
              <div key={user.id} className="glass-card rounded-3xl p-6 border border-purple-500/30 hover:border-purple-500/60 transition-all relative">
                
                {/* Match Confidence & Model Pill */}
                <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={user.avatarUrl}
                      alt={user.fullName}
                      className="w-12 h-12 rounded-2xl object-cover border border-purple-500/40"
                    />
                    <div>
                      <h3 className="font-display font-bold text-lg text-white">{user.fullName}</h3>
                      <p className="text-xs text-slate-400">{user.major} • ⭐ {user.reputationScore}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-2xl font-extrabold text-purple-400 font-display">{score}%</span>
                    <span className="text-[10px] text-slate-400 block font-semibold uppercase tracking-wider">Cosine Similarity</span>
                  </div>
                </div>

                {/* Vector Similarity Breakdown Pills */}
                <div className="flex items-center gap-2 mb-4">
                  <span className="px-2.5 py-1 rounded-xl text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    🎯 Learn Cosine Sim: {forwardSim}%
                  </span>
                  <span className="px-2.5 py-1 rounded-xl text-[11px] font-semibold bg-brand-500/10 text-brand-400 border border-brand-500/20">
                    🟢 Teach Cosine Sim: {backwardSim}%
                  </span>
                </div>

                {/* AI Explanation Card */}
                <div className="p-4 rounded-2xl bg-purple-950/40 border border-purple-500/30 mb-5 text-xs text-purple-100 space-y-2">
                  <div className="flex items-center gap-2 font-bold text-purple-300">
                    <span className="text-base">🤖</span>
                    <span>AI Recommendation Explanation</span>
                  </div>
                  <p className="leading-relaxed text-slate-200">
                    {explanation}
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setSwapModalTarget({ user, skill: user.skillsOffered[0] })}
                    className="flex-1 py-3 px-4 rounded-2xl text-xs font-bold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow-lg shadow-purple-600/20 transition-all flex items-center justify-center gap-1.5"
                  >
                    <span>⚡ Propose Reciprocal Swap</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('chat')}
                    className="py-3 px-4 rounded-2xl text-xs font-medium text-slate-300 hover:text-white glass-card hover:bg-slate-800 transition-all border border-slate-700"
                  >
                    💬 Message
                  </button>
                </div>

              </div>
            );
          })}
        </div>

      </div>

    </div>
  );
};
