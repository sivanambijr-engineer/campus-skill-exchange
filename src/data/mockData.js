// =========================================================
// Campus Skill Exchange
// Static UI configuration only.
//
// IMPORTANT:
// This file must NOT contain fake users, swaps, messages,
// reviews, or other application records.
//
// Real application data comes from the FastAPI backend
// and PostgreSQL database.
// =========================================================

// Kept temporarily for backward compatibility with any
// component that still imports this constant.
//
// It intentionally contains no fake user.
export const INITIAL_CURRENT_USER = null;

// Kept temporarily for backward compatibility.
//
// Real users come from:
// GET /api/users
export const INITIAL_USERS = [];

// Kept temporarily for backward compatibility.
//
// Real swaps come from:
// GET /api/swaps
export const INITIAL_SWAPS = [];

// Kept temporarily for backward compatibility.
//
// Real messages come from:
// GET /api/swaps/{swap_id}/messages
export const INITIAL_MESSAGES = {};

// Kept temporarily for backward compatibility.
//
// Real reviews come from the backend.
export const INITIAL_REVIEWS = [];

// =========================================================
// CATEGORIES
// =========================================================

export const CATEGORIES = [
  {
    id: 'all',
    name: 'All Categories',
    icon: 'Sparkles'
  },
  {
    id: 'Programming',
    name: 'Coding & Tech',
    icon: 'Code'
  },
  {
    id: 'Languages',
    name: 'Languages',
    icon: 'Globe'
  },
  {
    id: 'Music',
    name: 'Music & Audio',
    icon: 'Music'
  },
  {
    id: 'Design',
    name: 'Design & Art',
    icon: 'Palette'
  },
  {
    id: 'Fitness',
    name: 'Fitness & Health',
    icon: 'Dumbbell'
  },
  {
    id: 'Academics',
    name: 'Academics',
    icon: 'BookOpen'
  }
];