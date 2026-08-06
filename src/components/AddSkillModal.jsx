import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export const AddSkillModal = () => {
  const { isAddSkillModalOpen, setIsAddSkillModalOpen, addSkill } = useApp();

  const [type, setType] = useState('OFFERED');
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Programming');
  const [proficiency, setProficiency] = useState('Intermediate');
  const [description, setDescription] = useState('');

  if (!isAddSkillModalOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name.trim()) return;

    addSkill({
      type,
      name: name.trim(),
      category,
      proficiency,
      description: description.trim()
    });

    setName('');
    setDescription('');
    setIsAddSkillModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">

      <div className="glass-card bg-slate-900 border border-slate-700/80 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative">

        {/* Close */}
        <button
          onClick={() => setIsAddSkillModalOpen(false)}
          className="absolute top-5 right-5 text-slate-400 hover:text-white w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center transition"
        >
          ✕
        </button>


        {/* Header */}
        <div className="flex items-center gap-3 mb-6">

          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-2xl border border-emerald-500/30">
            🚀
          </div>

          <div>
            <h2 className="font-display font-bold text-xl text-white">
              Add Your Skill
            </h2>

            <p className="text-xs text-slate-400">
              Share knowledge or find someone to learn from
            </p>
          </div>

        </div>



        <form onSubmit={handleSubmit} className="space-y-4">


          {/* Skill Type */}

          <div className="grid grid-cols-2 gap-2 p-1 bg-slate-800 rounded-2xl border border-slate-700">

            <button
              type="button"
              onClick={() => setType('OFFERED')}
              className={`py-2.5 rounded-xl text-xs font-semibold transition ${
                type === 'OFFERED'
                  ? 'bg-emerald-500 text-white shadow-lg'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              🟢 I Teach
            </button>


            <button
              type="button"
              onClick={() => setType('DESIRED')}
              className={`py-2.5 rounded-xl text-xs font-semibold transition ${
                type === 'DESIRED'
                  ? 'bg-indigo-500 text-white shadow-lg'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              🎯 I Learn
            </button>

          </div>



          {/* Skill Name */}

          <div>

            <label className="text-xs font-semibold text-slate-300 block mb-1.5">
              Skill Name
            </label>

            <input
              value={name}
              onChange={(e)=>setName(e.target.value)}
              placeholder="Eg: Python, Guitar, UI Design, GitHub..."
              className="w-full glass-input text-sm text-white rounded-xl px-4 py-3 bg-slate-800 focus:outline-none"
              required
            />

          </div>




          {/* Category + Level */}

          <div className="grid grid-cols-2 gap-3">

            <div>

              <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                Category
              </label>

              <select
                value={category}
                onChange={(e)=>setCategory(e.target.value)}
                className="w-full glass-input text-sm text-white rounded-xl px-3 py-3 bg-slate-800"
              >

                <option>Programming</option>
                <option>AI & Data Science</option>
                <option>Music</option>
                <option>Design</option>
                <option>Communication</option>
                <option>Academics</option>
                <option>Other</option>

              </select>

            </div>



            <div>

              <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                Level
              </label>

              <select
                value={proficiency}
                onChange={(e)=>setProficiency(e.target.value)}
                className="w-full glass-input text-sm text-white rounded-xl px-3 py-3 bg-slate-800"
              >

                <option>Beginner</option>
                <option>Intermediate</option>
                <option>Advanced</option>
                <option>Expert</option>

              </select>

            </div>


          </div>





          {/* Description */}

          <div>

            <label className="text-xs font-semibold text-slate-300 block mb-1.5">
              About This Skill
            </label>


            <textarea
              rows="3"
              value={description}
              onChange={(e)=>setDescription(e.target.value)}
              placeholder={
                type === 'OFFERED'
                ? "Example: Can teach Python basics, ML concepts and Git workflow..."
                : "Example: Want to learn React, music production..."
              }
              className="w-full glass-input text-sm text-white rounded-xl p-3 bg-slate-800 resize-none"
            />

          </div>




          {/* Actions */}

          <div className="flex gap-3 pt-2">


            <button
              type="button"
              onClick={()=>setIsAddSkillModalOpen(false)}
              className="flex-1 py-3 rounded-xl text-xs font-semibold text-slate-400 bg-slate-800 hover:bg-slate-700 transition"
            >
              Cancel
            </button>


            <button
              type="submit"
              className="flex-1 py-3 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 shadow-lg shadow-emerald-500/20 transition"
            >
              Add Skill ✨
            </button>


          </div>


        </form>

      </div>

    </div>
  );
};