import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export const Dashboard = () => {
  const {
    swaps,
    currentUser,
    updateSwapStatus,
    setActiveChatSwapId,
    setActiveTab,
    setReviewModalTargetSwap
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState('ALL'); // ALL, PENDING, ACCEPTED, COMPLETED

  const filteredSwaps = swaps.filter(swap => {
    const isParticipant = swap.requesterId === currentUser.id || swap.recipientId === currentUser.id;
    if (!isParticipant) return false;

    if (activeSubTab === 'ALL') return true;
    return swap.status === activeSubTab;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'PENDING':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">⏳ Pending Approval</span>;
      case 'ACCEPTED':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">🤝 Active Swap</span>;
      case 'COMPLETED':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-brand-500/20 text-brand-300 border border-brand-500/30">✅ Completed</span>;
      case 'REJECTED':
      case 'CANCELLED':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-slate-800 text-slate-400 border border-slate-700">Cancelled</span>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Workspace Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-card p-6 rounded-3xl border border-slate-800">
        <div>
          <h1 className="font-display font-bold text-2xl text-white">Swaps Workspace & Pipeline</h1>
          <p className="text-xs text-slate-400">Manage pending proposals, active exchanges, and completed skill trades.</p>
        </div>

        {/* Tab Pills */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-950 rounded-2xl border border-slate-800">
          {['ALL', 'PENDING', 'ACCEPTED', 'COMPLETED'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveSubTab(tab)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeSubTab === tab
                  ? 'bg-brand-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {tab === 'ALL' ? 'All Swaps' : tab}
            </button>
          ))}
        </div>
      </div>

      {/* Swaps List */}
      {filteredSwaps.length > 0 ? (
        <div className="space-y-4">
          {filteredSwaps.map(swap => {
            const isRequester = swap.requesterId === currentUser.id;

            return (
              <div key={swap.id} className="glass-card rounded-3xl p-6 border border-slate-800 hover:border-slate-700 transition-all flex flex-col md:flex-row md:items-center justify-between gap-6">
                
                {/* Left Info */}
                <div className="flex items-start gap-4">
                  <img
                    src={swap.recipientAvatar}
                    alt={swap.recipientName}
                    className="w-14 h-14 rounded-2xl object-cover border border-slate-700 flex-shrink-0"
                  />
                  
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <h3 className="font-display font-bold text-base text-white">{swap.recipientName}</h3>
                      {getStatusBadge(swap.status)}
                    </div>

                    <div className="text-xs text-slate-300 font-medium flex flex-wrap items-center gap-2">
                      <span className="text-emerald-400">Offered: {swap.offeredSkill}</span>
                      <span className="text-slate-600">↔</span>
                      <span className="text-brand-400">Desired: {swap.desiredSkill}</span>
                    </div>

                    <div className="flex items-center gap-4 text-xs text-slate-400 pt-1">
                      <span>📍 {swap.meetingLocation} ({swap.meetingType === 'IN_PERSON' ? 'In-Person' : 'Virtual'})</span>
                      <span>⏰ {swap.proposedTime}</span>
                    </div>
                  </div>
                </div>

                {/* Right Actions */}
                <div className="flex items-center gap-2 pt-4 md:pt-0 border-t md:border-t-0 border-slate-800 justify-end">
                  
                  {/* Pending Incoming Actions */}
                  {swap.status === 'PENDING' && !isRequester && (
                    <>
                      <button
                        onClick={() => updateSwapStatus(swap.id, 'ACCEPTED')}
                        className="py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 shadow-md transition-all"
                      >
                        Accept Swap 🤝
                      </button>
                      <button
                        onClick={() => updateSwapStatus(swap.id, 'REJECTED')}
                        className="py-2.5 px-3 rounded-xl text-xs font-semibold text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors"
                      >
                        Decline
                      </button>
                    </>
                  )}

                  {/* Active Actions */}
                  {swap.status === 'ACCEPTED' && (
                    <>
                      <button
                        onClick={() => {
                          setActiveChatSwapId(swap.id);
                          setActiveTab('chat');
                        }}
                        className="py-2.5 px-4 rounded-xl text-xs font-semibold text-white bg-brand-600 hover:bg-brand-500 shadow-md transition-all"
                      >
                        💬 Open Chat
                      </button>
                      <button
                        onClick={() => updateSwapStatus(swap.id, 'COMPLETED')}
                        className="py-2.5 px-4 rounded-xl text-xs font-bold text-emerald-300 bg-emerald-500/20 border border-emerald-500/40 hover:bg-emerald-500/30 transition-all"
                      >
                        Mark Complete ✅
                      </button>
                    </>
                  )}

                  {/* Completed Actions */}
                  {swap.status === 'COMPLETED' && (
                    <button
                      onClick={() => setReviewModalTargetSwap(swap)}
                      className="py-2.5 px-4 rounded-xl text-xs font-bold text-amber-300 bg-amber-500/20 border border-amber-500/40 hover:bg-amber-500/30 transition-all"
                    >
                      ⭐ Leave Review
                    </button>
                  )}

                </div>

              </div>
            );
          })}
        </div>
      ) : (
        <div className="glass-card rounded-3xl p-12 text-center border border-slate-800">
          <div className="w-16 h-16 rounded-2xl bg-slate-800 text-slate-400 flex items-center justify-center text-3xl mx-auto mb-4">
            📂
          </div>
          <h3 className="font-display font-bold text-lg text-white">No swaps found in this filter</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            Propose a new skill swap from the marketplace or wait for incoming requests!
          </p>
          <button
            onClick={() => setActiveTab('marketplace')}
            className="mt-4 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-brand-600 hover:bg-brand-500"
          >
            Go to Marketplace 🔍
          </button>
        </div>
      )}

    </div>
  );
};
