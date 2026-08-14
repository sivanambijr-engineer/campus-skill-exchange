import React, {
  createContext,
  useContext,
  useEffect,
  useState
} from 'react';

import { api } from '../services/api';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // =========================================================
  // AUTH STATE
  // =========================================================

  const [currentUser, setCurrentUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // =========================================================
  // USER NORMALIZATION
  // =========================================================

  const processUser = (user) => {
    if (!user) return null;

    const skills = Array.isArray(user.skills)
      ? user.skills
      : [];

    const fullName =
      user.full_name ??
      user.fullName ??
      'Student';

    return {
      ...user,

      id: user.id,

      fullName,

      email:
        user.email ??
        '',

      avatarUrl:
        user.avatar_url ??
        user.avatarUrl ??
        `https://ui-avatars.com/api/?name=${encodeURIComponent(
          fullName
        )}&background=6366F1&color=ffffff&bold=true`,

      campusName:
        user.campus_name ??
        user.campusName ??
        'Velammal Institute of Technology',

      major:
        user.major ??
        '',

      bio:
        user.bio ??
        '',

      reputationScore:
        user.reputation_score ??
        user.reputationScore ??
        0,

      karmaPoints:
        user.karma_points ??
        user.karmaPoints ??
        0,

      swapsCompleted:
        user.swaps_completed ??
        user.swapsCompleted ??
        0,

      profile_completed:
        user.profile_completed ??
        user.profileCompleted ??
        false,

      skillsOffered:
        Array.isArray(user.skillsOffered)
          ? user.skillsOffered
          : skills.filter(
              skill =>
                skill?.type === 'OFFERED'
            ),

      skillsDesired:
        Array.isArray(user.skillsDesired)
          ? user.skillsDesired
          : skills.filter(
              skill =>
                skill?.type === 'DESIRED'
            )
    };
  };

  // =========================================================
  // DATABASE-BACKED APPLICATION STATE
  // =========================================================

  const [users, setUsers] = useState([]);
  const [swaps, setSwaps] = useState([]);
  const [messages, setMessages] = useState({});
  const [reviews, setReviews] = useState([]);
  const [aiRecommendations, setAiRecommendations] =
    useState([]);

  const [isConnectedToBackend, setIsConnectedToBackend] =
    useState(false);

  const [dataLoading, setDataLoading] =
    useState(false);

  const [dataError, setDataError] =
    useState(null);

  // =========================================================
  // UI STATE
  // =========================================================

  const [activeTab, setActiveTab] =
    useState('login');

  const [searchQuery, setSearchQuery] =
    useState('');

  const [selectedCategory, setSelectedCategory] =
    useState('all');

  const [activeChatSwapId, setActiveChatSwapId] =
    useState(null);

  const [toastMessage, setToastMessage] =
    useState(null);

  // =========================================================
  // MODALS
  // =========================================================

  const [swapModalTarget, setSwapModalTarget] =
    useState(null);

  const [isAddSkillModalOpen, setIsAddSkillModalOpen] =
    useState(false);

  const [reviewModalTargetSwap, setReviewModalTargetSwap] =
    useState(null);

  const [isScanningAI, setIsScanningAI] =
    useState(false);

  // =========================================================
  // LOAD DATABASE DATA
  // =========================================================

  const loadBackendData = async () => {
    if (!isAuthenticated || !currentUser) {
      return;
    }

    setDataLoading(true);
    setDataError(null);

    try {
      // -------------------------------------------------------
      // HEALTH CHECK
      // -------------------------------------------------------

      const health =
        await api.getHealth();

      if (
        !health ||
        health.status !== 'healthy'
      ) {
        throw new Error(
          'Backend health check failed.'
        );
      }

      setIsConnectedToBackend(true);

      // -------------------------------------------------------
      // USERS
      // -------------------------------------------------------

      const liveUsers =
        await api.getUsers();

      const processedUsers =
        Array.isArray(liveUsers)
          ? liveUsers
              .filter(Boolean)
              .map(processUser)
          : [];

      const allUsersIncludingCurrent = [
        currentUser,
        ...processedUsers
      ].filter(Boolean);

      const uniqueUsers = [
        ...new Map(
          allUsersIncludingCurrent.map(
            user => [
              String(user.id),
              user
            ]
          )
        ).values()
      ];

      setUsers(
        uniqueUsers.filter(
          user =>
            String(user.id) !==
            String(currentUser.id)
        )
      );

      // -------------------------------------------------------
      // SWAPS
      // -------------------------------------------------------

      const liveSwaps =
        await api.getSwaps();

      const normalizedSwaps =
        Array.isArray(liveSwaps)
          ? liveSwaps.map(swap => {

              const requesterId =
                swap.requester_id ??
                swap.requesterId;

              const recipientId =
                swap.recipient_id ??
                swap.recipientId;

              // Find participant records locally.
              const requester =
                uniqueUsers.find(
                  user =>
                    String(user.id) ===
                    String(requesterId)
                );

              const recipient =
                uniqueUsers.find(
                  user =>
                    String(user.id) ===
                    String(recipientId)
                );

              return {
                ...swap,

                // ------------------------------------------------
                // PARTICIPANT IDS
                // ------------------------------------------------

                requesterId,

                recipientId,

                // ------------------------------------------------
                // REQUESTER
                // ------------------------------------------------

                requesterName:
                  swap.requester_name ??
                  swap.requesterName ??
                  swap.requester?.full_name ??
                  swap.requester?.fullName ??
                  requester?.fullName ??
                  '',

                requesterAvatar:
                  swap.requester_avatar ??
                  swap.requesterAvatar ??
                  swap.requester?.avatar_url ??
                  swap.requester?.avatarUrl ??
                  requester?.avatarUrl ??
                  '',

                // ------------------------------------------------
                // RECIPIENT
                // ------------------------------------------------

                recipientName:
                  swap.recipient_name ??
                  swap.recipientName ??
                  swap.recipient?.full_name ??
                  swap.recipient?.fullName ??
                  recipient?.fullName ??
                  '',

                recipientAvatar:
                  swap.recipient_avatar ??
                  swap.recipientAvatar ??
                  swap.recipient?.avatar_url ??
                  swap.recipient?.avatarUrl ??
                  recipient?.avatarUrl ??
                  '',

                // ------------------------------------------------
                // SWAP DETAILS
                // ------------------------------------------------

                offeredSkill:
                  swap.offered_skill ??
                  swap.offeredSkill ??
                  '',

                desiredSkill:
                  swap.desired_skill ??
                  swap.desiredSkill ??
                  '',

                status:
                  swap.status ??
                  'PENDING',

                meetingType:
                  swap.meeting_type ??
                  swap.meetingType ??
                  'IN_PERSON',

                meetingLocation:
                  swap.meeting_location ??
                  swap.meetingLocation ??
                  null,

                proposedTime:
                  swap.proposed_time ??
                  swap.proposedTime ??
                  null,

                matchScore:
                  swap.match_score ??
                  swap.matchScore ??
                  0,

                createdAt:
                  swap.created_at ??
                  swap.createdAt ??
                  null
              };
            })
          : [];

      setSwaps(normalizedSwaps);

      // -------------------------------------------------------
      // MESSAGES
      // -------------------------------------------------------
      //
      // Every swap gets its messages directly from DB.
      //
      // GET /swaps/{swap_id}/messages
      //
      // This means ChatHub survives page refresh/login.
      // -------------------------------------------------------

      const loadedMessages = {};

      await Promise.all(
        normalizedSwaps.map(
          async swap => {
            try {
              const swapMessages =
                await api.getMessages(
                  swap.id
                );

              if (
                Array.isArray(
                  swapMessages
                )
              ) {
                loadedMessages[
                  swap.id
                ] =
                  swapMessages.map(
                    message => ({
                      ...message,

                      id:
                        message.id ??
                        `message-${Date.now()}-${Math.random()}`,

                      swapId:
                        message.swap_id ??
                        message.swapId ??
                        swap.id,

                      senderId:
                        message.sender_id ??
                        message.senderId,

                      senderName:
                        message.sender_name ??
                        message.senderName ??
                        'Student',

                      content:
                        message.content ??
                        '',

                      timestamp:
                        message.created_at ??
                        message.timestamp ??
                        new Date().toISOString()
                    })
                  );
              } else {
                loadedMessages[
                  swap.id
                ] = [];
              }

            } catch (error) {

              console.warn(
                `Failed to load messages for swap ${swap.id}:`,
                error.message
              );

              loadedMessages[
                swap.id
              ] = [];
            }
          }
        )
      );

      setMessages(
        loadedMessages
      );

      // -------------------------------------------------------
      // REVIEWS
      // -------------------------------------------------------

      const userIds = [
        currentUser?.id,
        ...processedUsers.map(
          user => user.id
        )
      ].filter(Boolean);

      const uniqueUserIds =
        [
          ...new Set(
            userIds.map(
              id => String(id)
            )
          )
        ];

      const loadedReviews = [];

      await Promise.all(
        uniqueUserIds.map(
          async userId => {
            try {
              const userReviews =
                await api.getReviews(
                  userId
                );

              if (
                Array.isArray(
                  userReviews
                )
              ) {
                loadedReviews.push(
                  ...userReviews
                );
              }

            } catch (error) {

              console.warn(
                `Failed to load reviews for user ${userId}:`,
                error.message
              );
            }
          }
        )
      );

      // Remove duplicates.
      const uniqueReviews = [
        ...new Map(
          loadedReviews.map(
            review => [
              review.id,
              review
            ]
          )
        ).values()
      ];

      setReviews(
        uniqueReviews
      );

      // -------------------------------------------------------
      // AI RECOMMENDATIONS
      // -------------------------------------------------------

      try {

        const aiMatches =
          await api.getAIRecommendations();

        setAiRecommendations(
          Array.isArray(aiMatches)
            ? aiMatches
            : []
        );

      } catch (error) {

        console.warn(
          'AI recommendations unavailable:',
          error.message
        );

        setAiRecommendations([]);
      }

    } catch (error) {

      console.error(
        'Database synchronization failed:',
        error
      );

      setIsConnectedToBackend(false);

      setDataError(
        error.message ||
        'Unable to connect to the backend.'
      );

      // IMPORTANT:
      // Never fall back to mock data.

      setUsers([]);
      setSwaps([]);
      setMessages({});
      setReviews([]);
      setAiRecommendations([]);

    } finally {

      setDataLoading(false);
    }
  };

  // =========================================================
  // INITIAL AUTH CHECK
  // =========================================================

  useEffect(() => {

    let mounted = true;

    const checkAuth = async () => {

      try {

        const user =
          await api.getMe();

        if (!mounted) {
          return;
        }

        if (user) {

          const processedUser =
            processUser(user);

          setCurrentUser(
            processedUser
          );

          setIsAuthenticated(
            true
          );

          if (
            !processedUser.profile_completed
          ) {
            setActiveTab(
              'verify-profile'
            );
          } else {
            setActiveTab(
              'marketplace'
            );
          }

        } else {

          setIsAuthenticated(false);
          setCurrentUser(null);
          setActiveTab('login');
        }

      } catch (error) {

        if (!mounted) {
          return;
        }

        setIsAuthenticated(false);
        setCurrentUser(null);
        setActiveTab('login');

      } finally {

        if (mounted) {
          setAuthLoading(false);
        }
      }
    };

    checkAuth();

    return () => {
      mounted = false;
    };

  }, []);

  // =========================================================
  // LOAD DATABASE AFTER AUTHENTICATION
  // =========================================================

  useEffect(() => {

    if (
      !isAuthenticated ||
      !currentUser
    ) {
      return;
    }

    loadBackendData();

  }, [
    isAuthenticated,
    currentUser?.id
  ]);

  // =========================================================
  // EMAIL / PASSWORD LOGIN
  // =========================================================

  const login = async (
    email,
    password
  ) => {

    setAuthLoading(true);

    try {

      const user =
        await api.login(
          email,
          password
        );

      const authenticatedUser =
        await api.getMe();

      const processedUser =
        processUser(
          authenticatedUser || user
        );

      setCurrentUser(
        processedUser
      );

      setIsAuthenticated(
        true
      );

      setIsConnectedToBackend(
        true
      );

      if (
        !processedUser.profile_completed
      ) {

        setActiveTab(
          'verify-profile'
        );

      } else {

        setActiveTab(
          'marketplace'
        );
      }

      return processedUser;

    } catch (error) {

      console.error(
        'Login failed:',
        error
      );

      setIsAuthenticated(false);
      setCurrentUser(null);
      setIsConnectedToBackend(false);

      throw error;

    } finally {

      setAuthLoading(false);
    }
  };

  // =========================================================
  // GOOGLE LOGIN
  // =========================================================

  const googleLogin = async (
    credential
  ) => {

    setAuthLoading(true);

    try {

      const user =
        await api.googleAuth(
          credential
        );

      const authenticatedUser =
        await api.getMe();

      const processedUser =
        processUser(
          authenticatedUser || user
        );

      setCurrentUser(
        processedUser
      );

      setIsAuthenticated(
        true
      );

      setIsConnectedToBackend(
        true
      );

      if (
        !processedUser.profile_completed
      ) {

        setActiveTab(
          'verify-profile'
        );

      } else {

        setActiveTab(
          'marketplace'
        );
      }

      return processedUser;

    } catch (error) {

      console.error(
        'Google authentication failed:',
        error
      );

      setIsAuthenticated(false);
      setCurrentUser(null);
      setIsConnectedToBackend(false);

      throw error;

    } finally {

      setAuthLoading(false);
    }
  };

  // =========================================================
  // LOGOUT
  // =========================================================

  const logout = async () => {

    try {

      await api.logout();

    } catch (error) {

      console.error(
        'Logout failed:',
        error
      );
    }

    setIsAuthenticated(false);
    setCurrentUser(null);
    setIsConnectedToBackend(false);

    setUsers([]);
    setSwaps([]);
    setMessages({});
    setReviews([]);
    setAiRecommendations([]);
    setDataError(null);

    setActiveChatSwapId(null);
    setActiveTab('login');
  };

  // =========================================================
  // REFRESH CURRENT USER
  // =========================================================

  const refreshUser = async () => {

    try {

      const user =
        await api.getMe();

      const processedUser =
        processUser(user);

      setCurrentUser(
        processedUser
      );

      setIsAuthenticated(
        true
      );

      if (
        !processedUser.profile_completed
      ) {

        setActiveTab(
          'verify-profile'
        );

      } else if (
        activeTab === 'verify-profile' ||
        activeTab === 'login'
      ) {

        setActiveTab(
          'marketplace'
        );
      }

      return processedUser;

    } catch (error) {

      console.error(
        'Failed to refresh user:',
        error
      );

      setIsAuthenticated(false);
      setCurrentUser(null);

      throw error;
    }
  };

  // =========================================================
  // TOAST
  // =========================================================

  const showToast = (
    title,
    description,
    type = 'success'
  ) => {

    setToastMessage({
      title,
      description,
      type
    });

    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // =========================================================
  // CREATE SWAP
  // =========================================================

  const createSwapRequest = async ({
    recipientUser,
    offeredSkillName,
    desiredSkillName,
    meetingType,
    meetingLocation,
    proposedTime,
    note
  }) => {

    if (
      !currentUser ||
      !recipientUser
    ) {
      return;
    }

    if (
      !isConnectedToBackend
    ) {

      showToast(
        'Backend unavailable',
        'Your swap was not saved.',
        'error'
      );

      return;
    }

    try {

      const createdSwap =
        await api.createSwap({
          recipient_id:
            recipientUser.id,

          offered_skill:
            offeredSkillName,

          desired_skill:
            desiredSkillName,

          meeting_type:
            meetingType,

          meeting_location:
            meetingLocation,

          proposed_time:
            proposedTime,

          note
        });

      // -------------------------------------------------------
      // DATABASE RESPONSE = SOURCE OF TRUTH
      // -------------------------------------------------------

      const normalizedSwap = {

        ...createdSwap,

        id:
          createdSwap.id,

        requesterId:
          createdSwap.requester_id ??
          createdSwap.requesterId ??
          currentUser.id,

        requesterName:
          createdSwap.requester_name ??
          createdSwap.requesterName ??
          currentUser.fullName,

        requesterAvatar:
          createdSwap.requester_avatar ??
          createdSwap.requesterAvatar ??
          currentUser.avatarUrl,

        recipientId:
          createdSwap.recipient_id ??
          createdSwap.recipientId ??
          recipientUser.id,

        recipientName:
          createdSwap.recipient_name ??
          createdSwap.recipientName ??
          recipientUser.fullName,

        recipientAvatar:
          createdSwap.recipient_avatar ??
          createdSwap.recipientAvatar ??
          recipientUser.avatarUrl,

        offeredSkill:
          createdSwap.offered_skill ??
          createdSwap.offeredSkill ??
          offeredSkillName,

        desiredSkill:
          createdSwap.desired_skill ??
          createdSwap.desiredSkill ??
          desiredSkillName,

        status:
          createdSwap.status ??
          'PENDING',

        meetingType:
          createdSwap.meeting_type ??
          createdSwap.meetingType ??
          meetingType,

        meetingLocation:
          createdSwap.meeting_location ??
          createdSwap.meetingLocation ??
          meetingLocation,

        proposedTime:
          createdSwap.proposed_time ??
          createdSwap.proposedTime ??
          proposedTime,

        matchScore:
          createdSwap.match_score ??
          createdSwap.matchScore ??
          0,

        createdAt:
          createdSwap.created_at ??
          createdSwap.createdAt ??
          new Date().toISOString()
      };

      // -------------------------------------------------------
      // UPDATE LOCAL STATE
      // -------------------------------------------------------

      setSwaps(prev => [
        normalizedSwap,
        ...prev
      ]);

      // -------------------------------------------------------
      // LOAD INITIAL MESSAGE
      //
      // Backend creates the initial note as a Message.
      // We load it from DB so ChatHub has exactly the
      // same source of truth.
      // -------------------------------------------------------

      try {

        const swapMessages =
          await api.getMessages(
            normalizedSwap.id
          );

        const normalizedMessages =
          Array.isArray(
            swapMessages
          )
            ? swapMessages.map(
                message => ({
                  ...message,

                  senderId:
                    message.sender_id ??
                    message.senderId,

                  senderName:
                    message.sender_name ??
                    message.senderName ??
                    currentUser.fullName,

                  timestamp:
                    message.created_at ??
                    message.timestamp
                })
              )
            : [];

        setMessages(prev => ({
          ...prev,

          [normalizedSwap.id]:
            normalizedMessages
        }));

      } catch (messageError) {

        console.warn(
          'Failed to load initial swap messages:',
          messageError
        );

        setMessages(prev => ({
          ...prev,

          [normalizedSwap.id]:
            prev[normalizedSwap.id] ||
            []
        }));
      }

      showToast(
        'Swap Request Sent! 🚀',
        `Connected with ${recipientUser.fullName}.`
      );

      setSwapModalTarget(null);

      return normalizedSwap;

    } catch (error) {

      console.error(
        'Failed to create swap:',
        error
      );

      showToast(
        'Swap failed',
        error.message ||
          'The swap could not be saved.',
        'error'
      );

      throw error;
    }
  };

  // =========================================================
  // UPDATE SWAP STATUS
  // =========================================================

  const updateSwapStatus = async (
    swapId,
    newStatus
  ) => {

    if (
      !isConnectedToBackend
    ) {

      showToast(
        'Backend unavailable',
        'The swap status was not saved.',
        'error'
      );

      return;
    }

    try {

      const updatedSwap =
        await api.updateSwapStatus(
          swapId,
          newStatus
        );

      setSwaps(prev =>
        prev.map(swap =>
          String(swap.id) ===
          String(swapId)
            ? {
                ...swap,

                ...updatedSwap,

                requesterId:
                  updatedSwap.requester_id ??
                  updatedSwap.requesterId ??
                  swap.requesterId,

                recipientId:
                  updatedSwap.recipient_id ??
                  updatedSwap.recipientId ??
                  swap.recipientId,

                status:
                  updatedSwap.status ??
                  newStatus
              }
            : swap
        )
      );

      // -------------------------------------------------------
      // COMPLETION UPDATES USER REWARDS
      // -------------------------------------------------------

      if (
        String(newStatus).toUpperCase() ===
        'COMPLETED'
      ) {

        const updatedUser =
          await api.getMe();

        if (updatedUser) {

          setCurrentUser(
            processUser(
              updatedUser
            )
          );
        }

        showToast(
          'Swap Complete! 🎉',
          'Your completed swap has been saved.'
        );

      } else if (
        String(newStatus).toUpperCase() ===
        'ACCEPTED'
      ) {

        showToast(
          'Swap Accepted! 🤝',
          'The swap is now active.'
        );

      } else if (
        String(newStatus).toUpperCase() ===
        'REJECTED'
      ) {

        showToast(
          'Swap Rejected',
          'The swap status has been saved.'
        );

      } else if (
        String(newStatus).toUpperCase() ===
        'CANCELLED'
      ) {

        showToast(
          'Swap Cancelled',
          'The swap status has been saved.'
        );
      }

      return updatedSwap;

    } catch (error) {

      console.error(
        'Failed to update swap status:',
        error
      );

      showToast(
        'Update failed',
        error.message ||
          'The swap status was not saved.',
        'error'
      );

      throw error;
    }
  };

  // =========================================================
  // SEND MESSAGE
  // =========================================================

  const sendMessage = async (
    swapId,
    text
  ) => {

    if (
      !currentUser ||
      !text?.trim()
    ) {
      return;
    }

    if (
      !isConnectedToBackend
    ) {

      showToast(
        'Backend unavailable',
        'Message was not saved.',
        'error'
      );

      return;
    }

    try {

      const savedMessage =
        await api.sendMessage(
          swapId,
          text.trim()
        );

      const normalizedMessage = {

        ...savedMessage,

        id:
          savedMessage?.id ??
          `message-${Date.now()}`,

        swapId:
          savedMessage?.swap_id ??
          savedMessage?.swapId ??
          swapId,

        senderId:
          savedMessage?.sender_id ??
          savedMessage?.senderId ??
          currentUser.id,

        senderName:
          savedMessage?.sender_name ??
          savedMessage?.senderName ??
          currentUser.fullName,

        content:
          savedMessage?.content ??
          text.trim(),

        timestamp:
          savedMessage?.created_at ??
          savedMessage?.timestamp ??
          new Date().toISOString()
      };

      setMessages(prev => ({

        ...prev,

        [swapId]: [
          ...(prev[swapId] || []),
          normalizedMessage
        ]
      }));

      return normalizedMessage;

    } catch (error) {

      console.error(
        'Failed to send message:',
        error
      );

      showToast(
        'Message failed',
        error.message ||
          'Message was not saved.',
        'error'
      );

      throw error;
    }
  };

  // =========================================================
  // ADD SKILL
  // =========================================================

  const addSkill = async (
    skillData
  ) => {

    if (!currentUser) {
      return;
    }

    if (
      !isConnectedToBackend
    ) {

      showToast(
        'Backend unavailable',
        'Skill was not saved.',
        'error'
      );

      return;
    }

    try {

      const savedSkill =
        await api.createSkill(
          skillData
        );

      const normalizedSkill =
        savedSkill || {
          ...skillData
        };

      // Temporary local update.
      setCurrentUser(prev => {

        if (!prev) {
          return prev;
        }

        if (
          skillData.type ===
          'OFFERED'
        ) {

          return {
            ...prev,

            skillsOffered: [
              ...(Array.isArray(
                prev.skillsOffered
              )
                ? prev.skillsOffered
                : []),

              normalizedSkill
            ]
          };
        }

        return {
          ...prev,

          skillsDesired: [
            ...(Array.isArray(
              prev.skillsDesired
            )
              ? prev.skillsDesired
              : []),

            normalizedSkill
          ]
        };
      });

      // -------------------------------------------------------
      // DATABASE = FINAL AUTHORITY
      // -------------------------------------------------------

      const updatedUser =
        await api.getMe();

      if (updatedUser) {

        setCurrentUser(
          processUser(
            updatedUser
          )
        );
      }

      showToast(
        'Skill Published! ✨',
        `Added "${skillData.name}" to your profile.`
      );

      setIsAddSkillModalOpen(
        false
      );

      return normalizedSkill;

    } catch (error) {

      console.error(
        'Failed to add skill:',
        error
      );

      showToast(
        'Skill failed',
        error.message ||
          'The skill was not saved.',
        'error'
      );

      throw error;
    }
  };

  // =========================================================
  // SUBMIT REVIEW
  // =========================================================

  const submitReview = async (
    swapId,
    revieweeId,
    rating,
    comment
  ) => {

    if (!currentUser) {
      return;
    }

    if (
      !isConnectedToBackend
    ) {

      showToast(
        'Backend unavailable',
        'Review was not saved.',
        'error'
      );

      return;
    }

    try {

      const savedReview =
        await api.submitReview(
          swapId,
          {
            reviewee_id:
              revieweeId,

            rating,

            comment
          }
        );

      const normalizedReview =
        savedReview || {
          swapId,

          reviewerId:
            currentUser.id,

          reviewerName:
            currentUser.fullName,

          reviewerAvatar:
            currentUser.avatarUrl,

          revieweeId,

          rating,

          comment
        };

      setReviews(prev => [
        normalizedReview,
        ...prev
      ]);

      // Refresh authoritative user data.
      const updatedUser =
        await api.getMe();

      if (updatedUser) {

        setCurrentUser(
          processUser(
            updatedUser
          )
        );
      }

      showToast(
        'Review Submitted! ⭐',
        'Your review has been saved.'
      );

      setReviewModalTargetSwap(
        null
      );

      return normalizedReview;

    } catch (error) {

      console.error(
        'Failed to submit review:',
        error
      );

      showToast(
        'Review failed',
        error.message ||
          'The review was not saved.',
        'error'
      );

      throw error;
    }
  };

  // =========================================================
  // AI SCAN
  // =========================================================

  const triggerAIScan = async () => {

    setIsScanningAI(true);

    try {

      if (
        !isConnectedToBackend
      ) {
        throw new Error(
          'Backend unavailable.'
        );
      }

      const matches =
        await api.getAIRecommendations();

      setAiRecommendations(
        Array.isArray(matches)
          ? matches
          : []
      );

      showToast(
        'AI Scan Complete! 🤖',
        'Recommendations refreshed from the backend.'
      );

    } catch (error) {

      console.error(
        'AI scan failed:',
        error
      );

      setAiRecommendations([]);

      showToast(
        'AI scan unavailable',
        error.message ||
          'Could not generate recommendations.',
        'error'
      );

    } finally {

      setIsScanningAI(false);
    }
  };

  // =========================================================
  // AI MATCH SCORE
  // =========================================================

  const calculateAIMatchScore = (
    otherUser
  ) => {

    if (!otherUser) {
      return 0;
    }

    const safeCurrentUser =
      currentUser || {};

    const myOffered =
      Array.isArray(
        safeCurrentUser.skillsOffered
      )
        ? safeCurrentUser.skillsOffered
        : [];

    const myDesired =
      Array.isArray(
        safeCurrentUser.skillsDesired
      )
        ? safeCurrentUser.skillsDesired
        : [];

    const otherOffered =
      Array.isArray(
        otherUser.skillsOffered
      )
        ? otherUser.skillsOffered
        : [];

    const otherDesired =
      Array.isArray(
        otherUser.skillsDesired
      )
        ? otherUser.skillsDesired
        : [];

    const normalizeSkill = (
      skill
    ) => {

      if (!skill) {
        return '';
      }

      if (
        typeof skill ===
        'string'
      ) {
        return skill
          .toLowerCase()
          .trim();
      }

      return String(
        skill.name || ''
      )
        .toLowerCase()
        .trim();
    };

    const myOfferedNames =
      myOffered
        .map(normalizeSkill)
        .filter(Boolean);

    const myDesiredNames =
      myDesired
        .map(normalizeSkill)
        .filter(Boolean);

    const otherOfferedNames =
      otherOffered
        .map(normalizeSkill)
        .filter(Boolean);

    const otherDesiredNames =
      otherDesired
        .map(normalizeSkill)
        .filter(Boolean);

    let score = 75;

    // My desired skill matches their offered skill.
    for (
      const desired of myDesiredNames
    ) {

      if (
        otherOfferedNames.some(
          offered =>
            offered.includes(
              desired
            ) ||
            desired.includes(
              offered
            )
        )
      ) {

        score += 12;
        break;
      }
    }

    // My offered skill matches their desired skill.
    for (
      const offered of myOfferedNames
    ) {

      if (
        otherDesiredNames.some(
          desired =>
            desired.includes(
              offered
            ) ||
            offered.includes(
              desired
            )
        )
      ) {

        score += 12;
        break;
      }
    }

    return Math.min(
      score,
      99
    );
  };

  // =========================================================
  // CONTEXT PROVIDER
  // =========================================================

  return (
    <AppContext.Provider
      value={{

        // ---------------------------------------------------
        // AUTH
        // ---------------------------------------------------

        currentUser,
        setCurrentUser,

        authLoading,
        isAuthenticated,

        login,
        googleLogin,
        logout,
        refreshUser,

        // ---------------------------------------------------
        // DATABASE STATE
        // ---------------------------------------------------

        users,
        swaps,
        messages,
        reviews,

        isConnectedToBackend,
        dataLoading,
        dataError,

        loadBackendData,

        // ---------------------------------------------------
        // UI
        // ---------------------------------------------------

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

        // ---------------------------------------------------
        // MODALS
        // ---------------------------------------------------

        swapModalTarget,
        setSwapModalTarget,

        isAddSkillModalOpen,
        setIsAddSkillModalOpen,

        reviewModalTargetSwap,
        setReviewModalTargetSwap,

        // ---------------------------------------------------
        // SWAPS
        // ---------------------------------------------------

        createSwapRequest,
        updateSwapStatus,

        // ---------------------------------------------------
        // CHAT
        // ---------------------------------------------------

        sendMessage,

        // ---------------------------------------------------
        // SKILLS
        // ---------------------------------------------------

        addSkill,

        // ---------------------------------------------------
        // REVIEWS
        // ---------------------------------------------------

        submitReview,

        // ---------------------------------------------------
        // AI
        // ---------------------------------------------------

        triggerAIScan,
        isScanningAI,

        aiRecommendations,
        calculateAIMatchScore
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () =>
  useContext(AppContext);