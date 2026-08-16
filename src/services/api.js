// =========================================================
// Campus Skill Exchange - API Service Layer
// React Frontend <-> FastAPI Backend
//
// AUTHENTICATION:
// Google OAuth only
// Session is maintained using an HTTP-only cookie.
// =========================================================

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  'http://localhost:8000/api';

// =========================================================
// HTTP REQUEST HELPER
// =========================================================

async function request(endpoint, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  const fetchOptions = {
    ...options,

    headers,

    /*
     * CRITICAL:
     *
     * This allows the browser to send the HTTP-only
     * access_token cookie to FastAPI.
     */
    credentials: 'include',
  };

  try {
    const response = await fetch(
      `${API_BASE_URL}${endpoint}`,
      fetchOptions
    );

    if (!response.ok) {
      const errorData = await response
        .json()
        .catch(() => ({}));

      throw new Error(
        errorData.detail ||
        `HTTP Error ${response.status}`
      );
    }

    if (response.status === 204) {
      return null;
    }

    return await response.json();

  } catch (error) {
    console.warn(
      `[API Connection Note] Request to ${endpoint} failed:`,
      error.message
    );

    throw error;
  }
}

// =========================================================
// API
// =========================================================

export const api = {

  // =======================================================
  // HEALTH
  // =======================================================

  getHealth: () =>
    request('/health'),

  // =======================================================
  // GOOGLE AUTHENTICATION
  // =======================================================

  /*
   * Primary Google authentication method.
   *
   * Login.jsx receives Google's credential.
   * AppContext calls api.googleLogin(credential).
   * This sends the credential to FastAPI.
   */
  googleLogin: (credential) =>
    request('/auth/google', {
      method: 'POST',

      body: JSON.stringify({
        credential,
      }),
    }),

  /*
   * Backward-compatible alias.
   *
   * Older code used googleAuth().
   * Keep it so existing components do not break.
   */
  googleAuth: (credential) =>
    request('/auth/google', {
      method: 'POST',

      body: JSON.stringify({
        credential,
      }),
    }),

  // =======================================================
  // LOGOUT
  // =======================================================

  logout: async () => {
    try {
      return await request(
        '/auth/logout',
        {
          method: 'POST',
        }
      );

    } catch (error) {
      console.warn(
        'Logout API request failed:',
        error.message
      );

      return null;
    }
  },

  // =======================================================
  // CURRENT USER
  // =======================================================

  getMe: () =>
    request('/auth/me'),

  // =======================================================
  // USERS
  // =======================================================

  getUsers: () =>
    request('/users'),

  getUserById: (id) =>
    request(`/users/${id}`),

  updateMyProfile: (profileData) =>
    request(
      '/users/me/profile',
      {
        method: 'PATCH',

        body: JSON.stringify(
          profileData
        ),
      }
    ),

  // =======================================================
  // SKILLS
  // =======================================================

  getSkills: (params = {}) => {
    const query =
      new URLSearchParams(
        params
      ).toString();

    return request(
      `/skills${
        query
          ? `?${query}`
          : ''
      }`
    );
  },

  createSkill: (skillData) =>
    request(
      '/skills',
      {
        method: 'POST',

        body: JSON.stringify(
          skillData
        ),
      }
    ),

  deleteSkill: (id) =>
    request(
      `/skills/${id}`,
      {
        method: 'DELETE',
      }
    ),

  // =======================================================
  // SWAPS
  // =======================================================

  getSwaps: () =>
    request('/swaps'),

  createSwap: (swapData) =>
    request(
      '/swaps',
      {
        method: 'POST',

        body: JSON.stringify(
          swapData
        ),
      }
    ),

  updateSwapStatus: (
    swapId,
    status
  ) =>
    request(
      `/swaps/${swapId}/status`,
      {
        method: 'PATCH',

        body: JSON.stringify({
          status,
        }),
      }
    ),

  // =======================================================
  // MESSAGES
  // =======================================================

  getMessages: (swapId) =>
    request(
      `/swaps/${swapId}/messages`
    ),

  sendMessage: (
    swapId,
    content
  ) =>
    request(
      `/swaps/${swapId}/messages`,
      {
        method: 'POST',

        body: JSON.stringify({
          content,
        }),
      }
    ),

  // =======================================================
  // REVIEWS
  // =======================================================

  getReviews: (userId) =>
    request(
      `/users/${userId}/reviews`
    ),

  submitReview: (
    swapId,
    reviewData
  ) =>
    request(
      `/swaps/${swapId}/reviews`,
      {
        method: 'POST',

        body: JSON.stringify(
          reviewData
        ),
      }
    ),

  // =======================================================
  // AI RECOMMENDATIONS
  // =======================================================

  getAIRecommendations: () =>
    request(
      '/ai/recommendations'
    ),
};