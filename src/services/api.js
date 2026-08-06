// API Service Layer connecting React Frontend to FastAPI Backend & AI Engine

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

// Helper for HTTP requests
async function request(endpoint, options = {}) {
  const token = localStorage.getItem('cse_token');
  
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...options.headers
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `HTTP Error ${response.status}`);
    }

    // Handle 204 No Content
    if (response.status === 204) return null;

    return await response.json();
  } catch (error) {
    console.warn(`[API Connection Note] Request to ${endpoint} failed:`, error.message);
    throw error;
  }
}

export const api = {
  // Health & Status
  getHealth: () => request('/health'),

  // Auth Endpoints
  register: (userData) => request('/auth/register', { method: 'POST', body: JSON.stringify(userData) }),
  login: (email, password) => {
    const formData = new URLSearchParams();
    formData.append('username', email);
    formData.append('password', password);
    return fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: formData
    }).then(res => res.json());
  },
  getMe: () => request('/auth/me'),

  // Users
  getUsers: () => request('/users'),
  getUserById: (id) => request(`/users/${id}`),

  // Skills
  getSkills: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/skills${query ? `?${query}` : ''}`);
  },
  createSkill: (skillData) => request('/skills', { method: 'POST', body: JSON.stringify(skillData) }),
  deleteSkill: (id) => request(`/skills/${id}`, { method: 'DELETE' }),

  // Swaps Lifecycle
  getSwaps: () => request('/swaps'),
  createSwap: (swapData) => request('/swaps', { method: 'POST', body: JSON.stringify(swapData) }),
  updateSwapStatus: (swapId, status) => request(`/swaps/${swapId}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status })
  }),

  // Chat Messages
  getMessages: (swapId) => request(`/swaps/${swapId}/messages`),
  sendMessage: (swapId, content) => request(`/swaps/${swapId}/messages`, {
    method: 'POST',
    body: JSON.stringify({ content })
  }),

  // Reviews
  getReviews: (userId) => request(`/users/${userId}/reviews`),
  submitReview: (swapId, reviewData) => request(`/swaps/${swapId}/reviews`, {
    method: 'POST',
    body: JSON.stringify(reviewData)
  }),

  // AI Reciprocal SentenceTransformer Engine
  getAIRecommendations: () => request('/ai/recommendations')
};
