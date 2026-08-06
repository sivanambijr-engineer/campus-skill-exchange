import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CATEGORIES } from '../data/mockData';
import { SkillCard } from '../components/SkillCard';

export const Marketplace = () => {
  const {
    users,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    setActiveTab,
    setIsAddSkillModalOpen
  } = useApp();

  const [proficiencyFilter, setProficiencyFilter] = useState('all');

  // Filter users by search query, selected category, and proficiency
  const filteredUsers = users.filter(user => {
    // Category match
    const hasCategorySkill = selectedCategory === 'all' || 
      user.skillsOffered.some(s => s.category === selectedCategory) ||
      user.skillsDesired.some(s => s.category === selectedCategory);

    if (!hasCategorySkill) return false;

    // Search query match
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const nameMatch = user.fullName.toLowerCase().includes(q);
      const majorMatch = user.major.toLowerCase().includes(q);
      const skillOfferedMatch = user.skillsOffered.some(s => s.name.toLowerCase().includes(q) || s.description?.toLowerCase().includes(q));
      const skillDesiredMatch = user.skillsDesired.some(s => s.name.toLowerCase().includes(q));

      if (!nameMatch && !majorMatch && !skillOfferedMatch && !skillDesiredMatch) {
        return false;
      }
    }

    // Proficiency filter
    if (proficiencyFilter !== 'all') {
      const hasProficiency = user.skillsOffered.some(s => s.proficiency.toLowerCase() === proficiencyFilter.toLowerCase());
      if (!hasProficiency) return false;
    }

    return true;
  });

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Hero Banner */}
      <div className="relative rounded-3xl overflow-hidden glass-card border border-brand-500/30 p-8 sm:p-12 text-center sm:text-left bg-gradient-to-r from-slate-900 via-slate-900/90 to-brand-950/80">
        
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-1/3 -mb-12 w-64 h-64 bg-accent-500/10 rounded-full blur-2xl pointer-events-none"></div>

        <div className="relative z-10 max-w-3xl">
          
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/15 border border-purple-500/30 text-purple-300 text-xs font-semibold mb-4">
            <span>✨ AI Reciprocal Matchmaker v2.4</span>
            <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-ping"></span>
          </div>

          <h1 className="font-display font-extrabold text-3xl sm:text-5xl tracking-tight text-white leading-tight">
            Exchange Skills. <br />
            <span className="gradient-text">Multiply Your Campus Potential.</span>
          </h1>

          <p className="mt-4 text-slate-300 text-sm sm:text-base leading-relaxed">
            Trade peer tutoring directly with fellow students. Teach Python for Acoustic Guitar, trade UI/UX design for Spanish lessons, or exchange workout coaching for audio mixing.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-4">
            <button
              onClick={() => setActiveTab('aimatches')}
              className="px-6 py-3 rounded-2xl text-sm font-bold text-white bg-gradient-to-r from-brand-500 to-indigo-600 hover:from-brand-400 hover:to-indigo-500 shadow-xl shadow-brand-500/25 transition-all transform hover:-translate-y-0.5"
            >
              🤖 Explore AI Matches (98% Reciprocal)
            </button>
            <button
              onClick={() => setIsAddSkillModalOpen(true)}
              className="px-6 py-3 rounded-2xl text-sm font-semibold text-slate-200 hover:text-white glass-card hover:bg-slate-800 transition-all border border-slate-700"
            >
              + List Your Skills
            </button>
          </div>

          {/* Key Metrics Row */}
          <div className="mt-8 pt-6 border-t border-slate-800/80 grid grid-cols-3 gap-4 text-left">
            <div>
              <span className="block font-display font-extrabold text-xl sm:text-2xl text-white">1,420+</span>
              <span className="text-xs text-slate-400 font-medium">Skills Available</span>
            </div>
            <div>
              <span className="block font-display font-extrabold text-xl sm:text-2xl text-purple-400">98.4%</span>
              <span className="text-xs text-slate-400 font-medium">Match Accuracy</span>
            </div>
            <div>
              <span className="block font-display font-extrabold text-xl sm:text-2xl text-emerald-400">4.9 ★</span>
              <span className="text-xs text-slate-400 font-medium">Avg Peer Rating</span>
            </div>
          </div>

        </div>

      </div>

      {/* Category Pills & Search Controls */}
      <div className="space-y-4">
        
        {/* Search Bar & Filters */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          
          {/* Main Search Input */}
          <div className="relative w-full sm:w-96">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search skills, topics, majors, or names..."
              className="w-full glass-input text-sm text-white rounded-2xl pl-11 pr-4 py-3 bg-slate-900/90 border border-slate-800"
            />
            <span className="absolute left-4 top-3.5 text-slate-400 text-sm">🔍</span>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-3 text-xs text-slate-500 hover:text-white"
              >
                ✕
              </button>
            )}
          </div>

          {/* Filters */}
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <select
              value={proficiencyFilter}
              onChange={(e) => setProficiencyFilter(e.target.value)}
              className="glass-input text-xs font-medium text-slate-300 rounded-xl px-3.5 py-2.5 bg-slate-900 border border-slate-800"
            >
              <option value="all">All Proficiency Levels</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
              <option value="expert">Expert</option>
            </select>
          </div>

        </div>

        {/* Category Selector Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-2xl text-xs font-semibold whitespace-nowrap transition-all border ${
                selectedCategory === cat.id
                  ? 'bg-brand-500/20 text-brand-300 border-brand-500/50 shadow-md shadow-brand-500/10'
                  : 'bg-slate-900/80 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-slate-200'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

      </div>

      {/* Skill Card Grid */}
      {filteredUsers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUsers.map(user => (
            <SkillCard key={user.id} user={user} />
          ))}
        </div>
      ) : (
        <div className="glass-card rounded-3xl p-12 text-center border border-slate-800">
          <div className="w-16 h-16 rounded-2xl bg-slate-800 text-slate-400 flex items-center justify-center text-3xl mx-auto mb-4">
            🔎
          </div>
          <h3 className="font-display font-bold text-lg text-white">No skills matching your search</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            Try adjusting your search terms or category filter. Or be the first to publish a listing!
          </p>
          <button
            onClick={() => { setSearchQuery(''); setSelectedCategory('all'); setProficiencyFilter('all'); }}
            className="mt-4 px-4 py-2 rounded-xl text-xs font-semibold text-brand-400 bg-brand-500/10 border border-brand-500/20"
          >
            Clear Filters
          </button>
        </div>
      )}

    </div>
  );
};
