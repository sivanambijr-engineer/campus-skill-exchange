-- PostgreSQL Schema for Campus Skill Exchange
-- Database: campus_skills_db

-- Enable UUID extension if needed
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop existing tables if re-initializing
DROP TABLE IF EXISTS reviews CASCADE;
DROP TABLE IF EXISTS messages CASCADE;
DROP TABLE IF EXISTS swaps CASCADE;
DROP TABLE IF EXISTS skills CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS ai_match_logs CASCADE;

-- 1. USERS TABLE
CREATE TABLE users (
    id VARCHAR(36) PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    avatar_url TEXT,
    campus_name VARCHAR(150) DEFAULT 'Stanford University',
    major VARCHAR(150),
    bio TEXT,
    reputation_score NUMERIC(3, 2) DEFAULT 5.00 CHECK (reputation_score >= 1.00 AND reputation_score <= 5.00),
    karma_points INT DEFAULT 100 CHECK (karma_points >= 0),
    swaps_completed INT DEFAULT 0 CHECK (swaps_completed >= 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);

-- 2. SKILLS TABLE
CREATE TABLE skills (
    id VARCHAR(36) PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    user_id VARCHAR(36) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(150) NOT NULL,
    category VARCHAR(100) NOT NULL, -- Programming, Languages, Music, Design, Fitness, Academics
    type VARCHAR(20) NOT NULL CHECK (type IN ('OFFERED', 'DESIRED')),
    proficiency VARCHAR(30) DEFAULT 'Intermediate' CHECK (proficiency IN ('Beginner', 'Intermediate', 'Advanced', 'Expert')),
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_skills_name ON skills(name);
CREATE INDEX idx_skills_category ON skills(category);
CREATE INDEX idx_skills_user_type ON skills(user_id, type);

-- 3. SWAPS TABLE
CREATE TABLE swaps (
    id VARCHAR(36) PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    requester_id VARCHAR(36) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    recipient_id VARCHAR(36) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    offered_skill VARCHAR(150) NOT NULL,
    desired_skill VARCHAR(150) NOT NULL,
    status VARCHAR(20) DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'ACCEPTED', 'REJECTED', 'COMPLETED', 'CANCELLED')),
    meeting_type VARCHAR(20) DEFAULT 'IN_PERSON' CHECK (meeting_type IN ('IN_PERSON', 'VIRTUAL')),
    meeting_location VARCHAR(255),
    proposed_time VARCHAR(100),
    match_score INT DEFAULT 85 CHECK (match_score >= 0 AND match_score <= 100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_swaps_requester ON swaps(requester_id);
CREATE INDEX idx_swaps_recipient ON swaps(recipient_id);
CREATE INDEX idx_swaps_status ON swaps(status);

-- 4. MESSAGES TABLE
CREATE TABLE messages (
    id VARCHAR(36) PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    swap_id VARCHAR(36) NOT NULL REFERENCES swaps(id) ON DELETE CASCADE,
    sender_id VARCHAR(36) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    sender_name VARCHAR(100) NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_messages_swap ON messages(swap_id);

-- 5. REVIEWS TABLE
CREATE TABLE reviews (
    id VARCHAR(36) PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    swap_id VARCHAR(36) NOT NULL REFERENCES swaps(id) ON DELETE CASCADE,
    reviewer_id VARCHAR(36) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    reviewer_name VARCHAR(100) NOT NULL,
    reviewer_avatar TEXT,
    reviewee_id VARCHAR(36) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_reviews_reviewee ON reviews(reviewee_id);

-- 6. AI MATCH LOGS TABLE
CREATE TABLE ai_match_logs (
    id VARCHAR(36) PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    user_a_id VARCHAR(36) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    user_b_id VARCHAR(36) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    match_score INT NOT NULL,
    reciprocal_details JSONB,
    generated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
