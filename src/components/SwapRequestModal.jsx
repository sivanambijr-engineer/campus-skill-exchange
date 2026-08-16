import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';

export const SwapRequestModal = () => {
  const {
    currentUser,
    swapModalTarget,
    setSwapModalTarget,
    createSwapRequest,
  } = useApp();

  const [selectedMyOfferedSkill, setSelectedMyOfferedSkill] = useState('');
  const [meetingType, setMeetingType] = useState('IN_PERSON');
  const [meetingLocation, setMeetingLocation] = useState('');
  const [proposedTime, setProposedTime] = useState('');
  const [note, setNote] = useState('');

  const targetUser = swapModalTarget?.user;
  const targetSkill = swapModalTarget?.skill;

  const myOfferedSkills = currentUser?.skillsOffered || [];

  useEffect(() => {
    if (myOfferedSkills.length > 0) {
      const firstSkill = myOfferedSkills[0];

      setSelectedMyOfferedSkill(
        firstSkill?.name || firstSkill?.skill_name || ''
      );
    } else {
      setSelectedMyOfferedSkill('');
    }
  }, [currentUser?.skillsOffered]);

  if (!swapModalTarget || !targetUser || !targetSkill) {
    return null;
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!selectedMyOfferedSkill) {
      return;
    }

    if (!meetingLocation.trim()) {
      return;
    }

    if (!proposedTime.trim()) {
      return;
    }

    createSwapRequest({
      recipientUser: targetUser,
      offeredSkillName: selectedMyOfferedSkill,
      desiredSkillName: targetSkill.name,
      meetingType,
      meetingLocation: meetingLocation.trim(),
      proposedTime: proposedTime.trim(),
      note: note.trim(),
    });
  };

  const firstName = targetUser.fullName
    ? targetUser.fullName.split(' ')[0]
    : targetUser.name || 'Student';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-3xl bg-slate-950 border border-slate-800 shadow-2xl p-6">

        {/* Close Button */}
        <button
          type="button"
          onClick={() => setSwapModalTarget(null)}
          className="absolute top-5 right-5 text-slate-400 hover:text-white text-lg w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center"
        >
          ✕
        </button>

        {/* Modal Title */}
        <div className="flex items-center gap-3 mb-6 pr-10">
          <div className="w-12 h-12 rounded-2xl bg-brand-500/20 text-brand-400 flex items-center justify-center text-2xl font-bold border border-brand-500/30">
            🔄
          </div>

          <div>
            <h2 className="font-display font-bold text-xl text-white">
              Propose Skill Swap
            </h2>

            <p className="text-xs text-slate-400">
              Pairing with {targetUser.fullName || targetUser.name || 'Student'}
              {targetUser.major ? ` (${targetUser.major})` : ''}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Target Skill Desired */}
          <div className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/60">
            <label className="text-[11px] font-bold text-brand-400 uppercase tracking-wider block mb-1">
              Skill You Want to Learn from {firstName}
            </label>

            <div className="font-semibold text-sm text-white flex items-center gap-2">
              <span>🎯 {targetSkill.name}</span>

              <span className="text-xs text-slate-400">
                ({targetSkill.proficiency || 'Not specified'})
              </span>
            </div>
          </div>

          {/* Select What You Offer */}
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1.5">
              What Skill will you teach in return?
            </label>

            {myOfferedSkills.length > 0 ? (
              <select
                value={selectedMyOfferedSkill}
                onChange={(e) => setSelectedMyOfferedSkill(e.target.value)}
                className="w-full glass-input text-sm text-white rounded-xl px-3.5 py-2.5 bg-slate-800 focus:outline-none"
                required
              >
                {myOfferedSkills.map((skill) => (
                  <option
                    key={skill.id || skill.name}
                    value={skill.name}
                  >
                    🟢 {skill.name}
                    {skill.proficiency ? ` (${skill.proficiency})` : ''}
                  </option>
                ))}
              </select>
            ) : (
              <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3">
                <p className="text-sm font-semibold text-amber-300">
                  You have no skills to offer yet.
                </p>

                <p className="text-xs text-amber-200/70 mt-1">
                  Add at least one skill you can teach before sending a swap
                  request.
                </p>
              </div>
            )}
          </div>

          {/* Meeting Format */}
          <div className="grid grid-cols-2 gap-3">

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                Meeting Format
              </label>

              <select
                value={meetingType}
                onChange={(e) => setMeetingType(e.target.value)}
                className="w-full glass-input text-sm text-white rounded-xl px-3.5 py-2.5 bg-slate-800"
              >
                <option value="IN_PERSON">
                  🏫 In-Person Campus
                </option>

                <option value="VIRTUAL">
                  💻 Virtual Meeting
                </option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                Proposed Time
              </label>

              <input
                type="text"
                value={proposedTime}
                onChange={(e) => setProposedTime(e.target.value)}
                placeholder="e.g. Tomorrow 4 PM"
                className="w-full glass-input text-sm text-white rounded-xl px-3.5 py-2.5 bg-slate-800"
                required
              />
            </div>

          </div>

          {/* Location */}
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1.5">
              Location / Link
            </label>

            <input
              type="text"
              value={meetingLocation}
              onChange={(e) => setMeetingLocation(e.target.value)}
              placeholder="e.g. Green Library 2nd Floor Study Room B"
              className="w-full glass-input text-sm text-white rounded-xl px-3.5 py-2.5 bg-slate-800"
              required
            />
          </div>

          {/* Optional Intro Message */}
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1.5">
              Intro Message / Learning Goals
            </label>

            <textarea
              rows="3"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Hey! Looking forward to swapping skills. I'm available..."
              className="w-full glass-input text-sm text-white rounded-xl p-3 bg-slate-800 resize-none"
            />
          </div>

          {/* Submit Buttons */}
          <div className="pt-2 flex gap-3">

            <button
              type="button"
              onClick={() => setSwapModalTarget(null)}
              className="flex-1 py-3 rounded-xl text-xs font-semibold text-slate-400 bg-slate-800 hover:bg-slate-700 transition-colors"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={myOfferedSkills.length === 0 || !selectedMyOfferedSkill}
              className="flex-1 py-3 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-brand-500 to-indigo-600 hover:from-brand-400 hover:to-indigo-500 shadow-lg shadow-brand-500/30 transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:from-brand-500 disabled:hover:to-indigo-600"
            >
              Send Swap Request 🚀
            </button>

          </div>

        </form>
      </div>
    </div>
  );
};