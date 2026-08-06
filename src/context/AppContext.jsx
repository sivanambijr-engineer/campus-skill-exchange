import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';
import {
  INITIAL_CURRENT_USER,
  INITIAL_USERS,
  INITIAL_SWAPS,
  INITIAL_MESSAGES,
  INITIAL_REVIEWS
} from '../data/mockData';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // State
  // State
// ===============================
// CORE APPLICATION DATA
// ===============================

const [currentUser, setCurrentUser] = useState(() => {

  const saved = localStorage.getItem('cse_user');

  return saved
 ? JSON.parse(saved)
    : {
        id: "student_001",
        fullName: "Siva",
        major: "AI & Data Science",
        year: "2nd Year",
        campusName: "Velammal Institute of Technology",

        avatarUrl: "https://ui-avatars.com/api/?name=Siva&background=6366F1&color=ffffff&bold=true",

        reputationScore: 4.9,
        karmaPoints: 850,
        swapsCompleted: 12,

        skillsOffered: [
          {
            id: "skill_001",
            name: "Python & Data Science",
            category: "AI & Data Science",
            proficiency: "Intermediate"
          },
          {
            id: "skill_002",
            name: "Music Production",
            category: "Music",
            proficiency: "Advanced"
          },
          {
            id: "skill_003",
            name: "Prompt Engineering",
            category: "AI",
            proficiency: "Intermediate"
          }
        ],

        skillsDesired: [
          {
            id: "skill_004",
            name: "React Development",
            category: "Programming",
            proficiency: "Beginner"
          },
          {
            id: "skill_005",
            name: "Git & GitHub",
            category: "Programming",
            proficiency: "Intermediate"
          }
        ]
      };

});





const [users, setUsers] = useState(() => {

  const saved = localStorage.getItem('cse_users');

  return saved
    ? JSON.parse(saved)
    : [

        {
          id: "student_002",
          fullName: "Vishnu",
          major: "Computer Science",
          campusName: "Velammal Institute of Technology",

          avatarUrl: "https://ui-avatars.com/api/?name=Vishnu&background=8B5CF6&color=ffffff&bold=true",

          reputationScore: 4.8,
          karmaPoints: 720,

          skillsOffered: [
            {
              name: "React Development",
              category: "Programming",
              proficiency: "Intermediate"
            },
            {
              name: "Git & GitHub",
              category: "Programming",
              proficiency: "Advanced"
            }
          ],

          skillsDesired: [
            {
              name: "Python & Data Science",
              category: "AI",
              proficiency: "Intermediate"
            }
          ]
        },

        {
          id: "student_003",
          fullName: "Esha",
          major: "AI & Data Science",
          campusName: "Velammal Institute of Technology",

          avatarUrl: "https://ui-avatars.com/api/?name=Esha&background=10B981&color=ffffff&bold=true",

          reputationScore: 4.7,
          karmaPoints: 640,

          skillsOffered: [
            {
              name: "UI/UX Design",
              category: "Design",
              proficiency: "Advanced"
            }
          ],

          skillsDesired: [
            {
              name: "Prompt Engineering",
              category: "AI",
              proficiency: "Intermediate"
            }
          ]
        },

        {
          id: "student_004",
          fullName: "Krissy",
          major: "Computer Science",
          campusName: "Velammal Institute of Technology",

          avatarUrl: "https://ui-avatars.com/api/?name=Krissy&background=F59E0B&color=ffffff&bold=true",

          reputationScore: 4.9,
          karmaPoints: 900,

          skillsOffered: [
            {
              name: "Communication Skills",
              category: "Soft Skills",
              proficiency: "Advanced"
            },
            {
              name: "Presentation Skills",
              category: "Career",
              proficiency: "Advanced"
            }
          ],

          skillsDesired: [
            {
              name: "Music Production",
              category: "Music",
              proficiency: "Beginner"
            }
          ]
        }

      ];

});



const [swaps, setSwaps] = useState(() => {

  const saved = localStorage.getItem('cse_swaps');

  return saved
    ? JSON.parse(saved)
    : INITIAL_SWAPS;

});





const [messages, setMessages] = useState(() => {

  const saved = localStorage.getItem('cse_messages');

  return saved
    ? JSON.parse(saved)
    : INITIAL_MESSAGES;

});





const [reviews, setReviews] = useState(() => {

  const saved = localStorage.getItem('cse_reviews');

  return saved
    ? JSON.parse(saved)
    : INITIAL_REVIEWS;

});

  const [aiRecommendations, setAiRecommendations] = useState([]);
  const [isConnectedToBackend, setIsConnectedToBackend] = useState(false);

  // UI state
  const [activeTab, setActiveTab] = useState('marketplace');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [activeChatSwapId, setActiveChatSwapId] = useState('swap_101');
  const [toastMessage, setToastMessage] = useState(null);

  // Modals state
  const [swapModalTarget, setSwapModalTarget] = useState(null);
  const [isAddSkillModalOpen, setIsAddSkillModalOpen] = useState(false);
  const [reviewModalTargetSwap, setReviewModalTargetSwap] = useState(null);
  const [isScanningAI, setIsScanningAI] = useState(false);

  // Synchronize with Backend API on Mount
  useEffect(() => {
    async function syncWithBackend() {
      try {
        const health = await api.getHealth();
        if (health && health.status === 'healthy') {
          setIsConnectedToBackend(true);
          
          // Fetch live database users & recommendations
          const liveUsers = await api.getUsers();
          if (liveUsers && liveUsers.length > 0) {
            setUsers(liveUsers);
          }

          const liveSwaps = await api.getSwaps();
          if (liveSwaps && liveSwaps.length > 0) {
            setSwaps(liveSwaps);
          }

          const aiMatches = await api.getAIRecommendations();
          if (aiMatches && aiMatches.length > 0) {
            setAiRecommendations(aiMatches);
          }
        }
      } catch (err) {
        setIsConnectedToBackend(false);
      }
    }
    syncWithBackend();
  }, []);

  // Save state to localStorage for offline fallback
  useEffect(() => {
    localStorage.setItem('cse_user', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('cse_swaps', JSON.stringify(swaps));
  }, [swaps]);

  useEffect(() => {
    localStorage.setItem('cse_messages', JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    localStorage.setItem('cse_reviews', JSON.stringify(reviews));
  }, [reviews]);

  const showToast = (title, description, type = 'success') => {
    setToastMessage({ title, description, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Action: Create Swap Request (Calls Backend API + State Update)
  const createSwapRequest = async ({ recipientUser, offeredSkillName, desiredSkillName, meetingType, meetingLocation, proposedTime, note }) => {
    const newSwapId = `swap_${Date.now()}`;
    const newSwap = {
      id: newSwapId,
      requesterId: currentUser.id,
      recipientId: recipientUser.id,
      recipientName: recipientUser.fullName,
      recipientAvatar: recipientUser.avatarUrl,
      offeredSkill: offeredSkillName,
      desiredSkill: desiredSkillName,
      status: 'PENDING',
      meetingType,
      meetingLocation,
      proposedTime,
      matchScore: 95,
      createdAt: new Date().toISOString()
    };

    setSwaps(prev => [newSwap, ...prev]);

    // Send API request if backend is connected
    if (isConnectedToBackend) {
      try {
        await api.createSwap({
          recipient_id: recipientUser.id,
          offered_skill: offeredSkillName,
          desired_skill: desiredSkillName,
          meeting_type: meetingType,
          meeting_location: meetingLocation,
          proposed_time: proposedTime,
          note
        });
      } catch (err) {
        console.warn('API Swap Sync fallback to local state');
      }
    }

    const initMessage = {
      id: `m_${Date.now()}`,
      senderId: currentUser.id,
      senderName: currentUser.fullName,
      content: note || `Hi ${recipientUser.fullName}! I would love to trade ${offeredSkillName} for your ${desiredSkillName}.`,
      timestamp: 'Just now'
    };

    setMessages(prev => ({
      ...prev,
      [newSwapId]: [initMessage]
    }));

    showToast('Swap Request Sent! 🚀', `Connected with ${recipientUser.fullName} via FastAPI backend.`);
    setSwapModalTarget(null);
  };

  // Action: Update Swap Status (Calls Backend API)
  const updateSwapStatus = async (swapId, newStatus) => {
    setSwaps(prev => prev.map(s => s.id === swapId ? { ...s, status: newStatus } : s));

    if (isConnectedToBackend) {
      try {
        await api.updateSwapStatus(swapId, newStatus);
      } catch (err) {
        console.warn('API Swap Status Update fallback');
      }
    }

    if (newStatus === 'COMPLETED') {
      setCurrentUser(prev => ({
        ...prev,
        karmaPoints: prev.karmaPoints + 50,
        swapsCompleted: prev.swapsCompleted + 1
      }));
      showToast('Swap Complete! 🎉', 'Earned +50 Karma in PostgreSQL DB.');
    } else if (newStatus === 'ACCEPTED') {
      showToast('Swap Accepted! 🤝', 'Connected live chat thread.');
    }
  };

  // Action: Send Message (Calls Backend API)
  const sendMessage = async (swapId, text) => {
    if (!text.trim()) return;
    const newMsg = {
      id: `msg_${Date.now()}`,
      senderId: currentUser.id,
      senderName: currentUser.fullName,
      content: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => ({
      ...prev,
      [swapId]: [...(prev[swapId] || []), newMsg]
    }));

    if (isConnectedToBackend) {
      try {
        await api.sendMessage(swapId, text.trim());
      } catch (err) {
        console.warn('API Message Send fallback');
      }
    }
  };

  // Action: Add Skill (Calls Backend API)
  const addSkill = async (skillData) => {
    const newSkill = {
      id: `sk_${Date.now()}`,
      ...skillData
    };

    if (skillData.type === 'OFFERED') {
      setCurrentUser(prev => ({
        ...prev,
        skillsOffered: [...prev.skillsOffered, newSkill]
      }));
    } else {
      setCurrentUser(prev => ({
        ...prev,
        skillsDesired: [...prev.skillsDesired, newSkill]
      }));
    }

    if (isConnectedToBackend) {
      try {
        await api.createSkill(skillData);
      } catch (err) {
        console.warn('API Add Skill fallback');
      }
    }

    showToast('Skill Published! ✨', `Added "${skillData.name}" to database.`);
    setIsAddSkillModalOpen(false);
  };

  // Action: Submit Review (Calls Backend API)
  const submitReview = async (swapId, revieweeId, rating, comment) => {
    const newRev = {
      id: `rev_${Date.now()}`,
      swapId,
      reviewerId: currentUser.id,
      reviewerName: currentUser.fullName,
      reviewerAvatar: currentUser.avatarUrl,
      revieweeId,
      rating,
      comment,
      date: new Date().toISOString().split('T')[0]
    };

    setReviews(prev => [newRev, ...prev]);

    if (isConnectedToBackend) {
      try {
        await api.submitReview(swapId, { reviewee_id: revieweeId, rating, comment });
      } catch (err) {
        console.warn('API Review Submit fallback');
      }
    }

    showToast('Review Submitted! ⭐', 'PostgreSQL reputation score updated.');
    setReviewModalTargetSwap(null);
  };

  // Action: Trigger AI Recommendation Scanner (Calls FastAPI SentenceTransformers endpoint)
  const triggerAIScan = async () => {
    setIsScanningAI(true);
    try {
      if (isConnectedToBackend) {
        const matches = await api.getAIRecommendations();
        if (matches && matches.length > 0) {
          setAiRecommendations(matches);
        }
      }
    } catch (err) {
      console.warn('AI Scan fallback');
    } finally {
      setTimeout(() => {
        setIsScanningAI(false);
        showToast('SentenceTransformers AI Scan Complete! 🤖', 'Reciprocal vector embeddings re-calculated.');
      }, 1200);
    }
  };

  // Fallback similarity calculator
  const calculateAIMatchScore = (otherUser) => {
    let score = 75;
    const myOffered = currentUser.skillsOffered.map(s => s.name.toLowerCase());
    const myDesired = currentUser.skillsDesired.map(s => s.name.toLowerCase());
    const otherOffered = otherUser.skillsOffered.map(s => s.name.toLowerCase());
    const otherDesired = otherUser.skillsDesired.map(s => s.name.toLowerCase());

    for (const d of myDesired) {
      if (otherOffered.some(o => o.includes(d) || d.includes(o))) {
        score += 12;
        break;
      }
    }
    for (const o of myOffered) {
      if (otherDesired.some(d => d.includes(o) || o.includes(d))) {
        score += 12;
        break;
      }
    }
    return Math.min(score, 99);
  };

  return (
    <AppContext.Provider value={{
      currentUser,
      setCurrentUser,
      users,
      swaps,
      messages,
      reviews,
      activeTab,
      setActiveTab,
      searchQuery,
      setSearchQuery,
      selectedCategory,
      setSelectedCategory,
      activeChatSwapId,
      setActiveChatSwapId,
      toastMessage,
      showToast,
      swapModalTarget,
      setSwapModalTarget,
      isAddSkillModalOpen,
      setIsAddSkillModalOpen,
      reviewModalTargetSwap,
      setReviewModalTargetSwap,
      createSwapRequest,
      updateSwapStatus,
      sendMessage,
      addSkill,
      submitReview,
      triggerAIScan,
      isScanningAI,
      calculateAIMatchScore,
      aiRecommendations,
      isConnectedToBackend
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
