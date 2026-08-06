export const INITIAL_CURRENT_USER = {
  id: 'usr_001',
  fullName: 'Shiva',
  email: 'shiva@vit.edu',
  avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43d?auto=format&fit=crop&q=80&w=250',
  campusName: 'Velammal Institute of Technology',
  major: 'Artificial Intelligence & Data Science',
  bio: 'AI & DS student passionate about Python, prompt engineering, music production and building practical AI projects with teammates.',
  reputationScore: 4.8,
  karmaPoints: 285,
  swapsCompleted: 10,

  skillsOffered: [
    {
      id: 'sk_off_1',
      name: 'Basic Python',
      category: 'Programming',
      proficiency: 'Intermediate',
      description: 'Python fundamentals, problem solving and beginner AI projects.'
    },
    {
      id: 'sk_off_2',
      name: 'Prompt Engineering',
      category: 'AI',
      proficiency: 'Intermediate',
      description: 'Writing effective prompts for ChatGPT and other AI tools.'
    },
    {
      id: 'sk_off_3',
      name: 'Music Production',
      category: 'Music',
      proficiency: 'Intermediate',
      description: 'FL Studio basics, MIDI, simple mixing and music production.'
    }
  ],

  skillsDesired: [
    {
      id: 'sk_des_1',
      name: 'React Development',
      category: 'Programming',
      proficiency: 'Beginner',
      description: 'Learning React to build modern web applications.'
    },
    {
      id: 'sk_des_2',
      name: 'UI/UX Design',
      category: 'Design',
      proficiency: 'Beginner',
      description: 'Interested in improving UI design using Figma.'
    }
  ]
};

export const INITIAL_USERS = [
  {
    id: 'usr_002',
    fullName: 'Vishnu',
    email: 'vishnu@vit.ac.in',
    avatarUrl: 'https://ui-avatars.com/api/?name=Vishnu&background=2563eb&color=fff',
    campusName: 'Velammal Institute of Technology',
    major: 'Artificial Intelligence & Data Science',
    bio: 'Interested in Git, web development and building AI-powered applications with teammates.',
    reputationScore: 4.7,
    karmaPoints: 220,
    swapsCompleted: 8,
    skillsOffered: [
      {
        id: 'sk_v1',
        name: 'Git & GitHub',
        category: 'Programming',
        proficiency: 'Intermediate',
        description: 'Version control, repositories, branching and collaboration.'
      },
      {
        id: 'sk_v2',
        name: 'HTML & CSS',
        category: 'Programming',
        proficiency: 'Intermediate',
        description: 'Responsive layouts and basic website design.'
      }
    ],
    skillsDesired: [
      {
        id: 'sk_v3',
        name: 'Prompt Engineering',
        category: 'Programming',
        proficiency: 'Beginner',
        description: 'Learning effective prompting for AI tools.'
      }
    ]
  },

  {
    id: 'usr_003',
    fullName: 'Esha',
    email: 'esha@vit.ac.in',
    avatarUrl: 'https://ui-avatars.com/api/?name=Esha&background=9333ea&color=fff',
    campusName: 'Velammal Institute of Technology',
    major: 'Artificial Intelligence & Data Science',
    bio: 'Creative student interested in presentations, documentation and teamwork.',
    reputationScore: 4.8,
    karmaPoints: 240,
    swapsCompleted: 9,
    skillsOffered: [
      {
        id: 'sk_e1',
        name: 'Presentation Design',
        category: 'Design',
        proficiency: 'Intermediate',
        description: 'Creating clean PPTs and project presentations.'
      },
      {
        id: 'sk_e2',
        name: 'Documentation',
        category: 'Academics',
        proficiency: 'Intermediate',
        description: 'Project reports and technical documentation.'
      }
    ],
    skillsDesired: [
      {
        id: 'sk_e3',
        name: 'Python',
        category: 'Programming',
        proficiency: 'Beginner',
        description: 'Learning Python for AI and data science.'
      }
    ]
  },

  {
    id: 'usr_004',
    fullName: 'Krissy',
    email: 'krissy@vit.ac.in',
    avatarUrl: 'https://ui-avatars.com/api/?name=Krissy&background=db2777&color=fff',
    campusName: 'Velammal Institute of Technology',
    major: 'Artificial Intelligence & Data Science',
    bio: 'Interested in software development, testing and collaborative hackathon projects.',
    reputationScore: 4.6,
    karmaPoints: 205,
    swapsCompleted: 7,
    skillsOffered: [
      {
        id: 'sk_k1',
        name: 'Basic Java',
        category: 'Programming',
        proficiency: 'Intermediate',
        description: 'Core Java concepts and OOP fundamentals.'
      },
      {
        id: 'sk_k2',
        name: 'Software Testing',
        category: 'Programming',
        proficiency: 'Beginner',
        description: 'Basic testing and debugging of applications.'
      }
    ],
    skillsDesired: [
      {
        id: 'sk_k3',
        name: 'Music Production',
        category: 'Music',
        proficiency: 'Beginner',
        description: 'Interested in FL Studio and digital music creation.'
      }
    ]
  },

  {
    id: 'usr_005',
    fullName: 'Demo Student',
    email: 'student@vit.ac.in',
    avatarUrl: 'https://ui-avatars.com/api/?name=Student&background=16a34a&color=fff',
    campusName: 'Velammal Institute of Technology',
    major: 'Computer Science',
    bio: 'Looking to exchange technical and communication skills with fellow students.',
    reputationScore: 4.5,
    karmaPoints: 180,
    swapsCompleted: 5,
    skillsOffered: [
      {
        id: 'sk_d1',
        name: 'Communication Skills',
        category: 'Academics',
        proficiency: 'Intermediate',
        description: 'Presentation and speaking practice.'
      }
    ],
    skillsDesired: [
      {
        id: 'sk_d2',
        name: 'Python',
        category: 'Programming',
        proficiency: 'Beginner',
        description: 'Learning Python programming.'
      }
    ]
  }
];
export const INITIAL_SWAPS = [
  {
    id: 'swap_101',
    requesterId: 'usr_001',
    recipientId: 'usr_002',
    recipientName: 'Vishnu',
    recipientAvatar: 'https://ui-avatars.com/api/?name=Vishnu&background=2563eb&color=fff',
    offeredSkill: 'Basic Python',
    desiredSkill: 'Git & GitHub',
    status: 'ACCEPTED',
    meetingType: 'IN_PERSON',
    meetingLocation: 'VIT Library - Discussion Hall',
    proposedTime: 'Tomorrow at 4:00 PM',
    matchScore: 97,
    createdAt: '2026-08-01T14:30:00Z'
  },

  {
    id: 'swap_102',
    requesterId: 'usr_003',
    recipientId: 'usr_001',
    recipientName: 'Esha',
    recipientAvatar: 'https://ui-avatars.com/api/?name=Esha&background=9333ea&color=fff',
    offeredSkill: 'Presentation Design',
    desiredSkill: 'Prompt Engineering',
    status: 'PENDING',
    meetingType: 'VIRTUAL',
    meetingLocation: 'Google Meet',
    proposedTime: 'Friday at 2:00 PM',
    matchScore: 95,
    createdAt: '2026-08-02T09:15:00Z'
  },

  {
    id: 'swap_103',
    requesterId: 'usr_001',
    recipientId: 'usr_004',
    recipientName: 'Krissy',
    recipientAvatar: 'https://ui-avatars.com/api/?name=Krissy&background=db2777&color=fff',
    offeredSkill: 'Music Production',
    desiredSkill: 'Basic Java',
    status: 'COMPLETED',
    meetingType: 'IN_PERSON',
    meetingLocation: 'Innovation Lab',
    proposedTime: 'Last Week',
    matchScore: 96,
    createdAt: '2026-07-28T10:00:00Z'
  }
];

export const INITIAL_MESSAGES = {
  swap_101: [
    {
      id: 'm1',
      senderId: 'usr_002',
      senderName: 'Vishnu',
      content: "Machi Siva! 😄 I saw your Basic Python skill. Can you help me understand functions and file handling?",
      timestamp: 'Yesterday 2:30 PM'
    },
    {
      id: 'm2',
      senderId: 'usr_001',
      senderName: 'Shiva',
      content: "Sure da machi! 🤝 In return, teach me Git & GitHub properly. I still get confused with branches 😅",
      timestamp: 'Yesterday 2:33 PM'
    },
    {
      id: 'm3',
      senderId: 'usr_002',
      senderName: 'Vishnu',
      content: "Deal 😂 Library after classes tomorrow? We'll finish both before the hackathon.",
      timestamp: 'Yesterday 2:36 PM'
    }
  ],

  swap_102: [
    {
      id: 'm4',
      senderId: 'usr_003',
      senderName: 'Esha',
      content: "Siva, can you teach me Prompt Engineering? I'll help with our PPT design and documentation.",
      timestamp: 'Today 9:15 AM'
    },
    {
      id: 'm5',
      senderId: 'usr_001',
      senderName: 'Shiva',
      content: "Perfect! That's exactly what we need for our project demo. Let's meet online this evening.",
      timestamp: 'Today 9:20 AM'
    }
  ],

  swap_103: [
    {
      id: 'm6',
      senderId: 'usr_004',
      senderName: 'Krissy',
      content: "Siva, thanks for showing me FL Studio basics! 🎵 Next time I'll explain Java collections.",
      timestamp: '3 days ago'
    },
    {
      id: 'm7',
      senderId: 'usr_001',
      senderName: 'Shiva',
      content: "Awesome 😄 Looking forward to it. Let's make our hackathon project even better.",
      timestamp: '3 days ago'
    }
  ]
};

export const INITIAL_REVIEWS = [
  {
    id: 'rev_1',
    swapId: 'swap_103',
    reviewerId: 'usr_004',
    reviewerName: 'Esha',
    reviewerAvatar: 'https://ui-avatars.com/api/?name=Esha&background=8B5CF6&color=fff',
    revieweeId: 'usr_001',
    rating: 5,
    comment: 'Siva explained GitHub and basic Python really well. Our hackathon workflow became much smoother after the session. Super patient while teaching!',
    date: '2026-07-21'
  },
  {
    id: 'rev_2',
    swapId: 'swap_099',
    reviewerId: 'usr_002',
    reviewerName: 'Vishnu',
    reviewerAvatar: 'https://ui-avatars.com/api/?name=Vishnu&background=2563EB&color=fff',
    revieweeId: 'usr_001',
    rating: 5,
    comment: 'Machi, semma da! Siva helped me understand Git, GitHub and project structure. We finished our work much faster after that.',
    date: '2026-07-15'
  },
  {
    id: 'rev_3',
    swapId: 'swap_104',
    reviewerId: 'usr_003',
    reviewerName: 'Krissy',
    reviewerAvatar: 'https://ui-avatars.com/api/?name=Krissy&background=EC4899&color=fff',
    revieweeId: 'usr_001',
    rating: 5,
    comment: 'Really supportive teammate. Explained prompt engineering concepts clearly and helped improve our AI responses during development.',
    date: '2026-07-28'
  }
];

export const CATEGORIES = [
  { id: 'all', name: 'All Categories', icon: 'Sparkles' },
  { id: 'Programming', name: 'Coding & Tech', icon: 'Code' },
  { id: 'Languages', name: 'Languages', icon: 'Globe' },
  { id: 'Music', name: 'Music & Audio', icon: 'Music' },
  { id: 'Design', name: 'Design & Art', icon: 'Palette' },
  { id: 'Fitness', name: 'Fitness & Health', icon: 'Dumbbell' },
  { id: 'Academics', name: 'Academics', icon: 'BookOpen' }
];
