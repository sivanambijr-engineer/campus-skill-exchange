-- PostgreSQL Seed Data Script for Campus Skill Exchange

-- Clear existing data
TRUNCATE TABLE reviews, messages, swaps, skills, users, ai_match_logs CASCADE;

-- Insert Users (Password: password123)
INSERT INTO users (id, email, password_hash, full_name, avatar_url, campus_name, major, bio, reputation_score, karma_points, swaps_completed) VALUES
('usr_001', 'sivan@stanford.edu', '$2b$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeg6Lruj3vjPGga31lW', 'Sivan Ambi', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250', 'Stanford University', 'Computer Science (Senior)', 'Building AI tools by day, practicing acoustic guitar by night. Passionate about peer learning!', 4.90, 340, 14),
('usr_002', 'elena@stanford.edu', '$2b$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeg6Lruj3vjPGga31lW', 'Elena Rostova', 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=250', 'Stanford University', 'Linguistics & Spanish Lit (Junior)', 'Native Spanish speaker and acoustic guitarist of 8 years. Excited to exchange skills for coding help!', 4.95, 510, 22),
('usr_003', 'marcus@stanford.edu', '$2b$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeg6Lruj3vjPGga31lW', 'Marcus Vance', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250', 'Stanford University', 'Music Production (Senior)', 'Producer and audio engineer. Love teaching music theory and mixing in Ableton Live.', 4.80, 280, 9),
('usr_004', 'priya@stanford.edu', '$2b$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeg6Lruj3vjPGga31lW', 'Priya Sharma', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=250', 'Stanford University', 'UI/UX Design & HCI (Master''s)', 'Figma nerd and product designer. Can teach wireframing, prototyping, and design systems.', 5.00, 640, 28);

-- Insert Skills Offered & Desired
INSERT INTO skills (id, user_id, name, category, type, proficiency, description) VALUES
('sk_001', 'usr_001', 'Python & Data Science', 'Programming', 'OFFERED', 'Expert', 'Pandas, NumPy, Machine Learning basics, and Web Scraping.'),
('sk_002', 'usr_001', 'Conversational Spanish', 'Languages', 'DESIRED', 'Intermediate', 'Looking for weekly casual speaking sessions for study abroad.'),
('sk_003', 'usr_002', 'Conversational Spanish', 'Languages', 'OFFERED', 'Expert', 'Native fluency, grammar tips, and authentic accent practice.'),
('sk_004', 'usr_002', 'Python & Data Science', 'Programming', 'DESIRED', 'Beginner', 'Wants to automate text analysis for linguistics research.'),
('sk_005', 'usr_003', 'Music Production & Mixing', 'Music', 'OFFERED', 'Expert', 'Ableton Live, beat making, EQing, and vocal processing.'),
('sk_006', 'usr_003', 'Full-Stack Web Dev', 'Programming', 'DESIRED', 'Beginner', 'Wants to create a custom portfolio web app.'),
('sk_007', 'usr_004', 'UI/UX Design in Figma', 'Design', 'OFFERED', 'Expert', 'Design systems, auto-layout, interactive prototypes, and UX heuristics.');

-- Insert Swaps
INSERT INTO swaps (id, requester_id, recipient_id, offered_skill, desired_skill, status, meeting_type, meeting_location, proposed_time, match_score) VALUES
('swap_101', 'usr_001', 'usr_002', 'Python & Data Science', 'Conversational Spanish', 'ACCEPTED', 'IN_PERSON', 'Green Library 2nd Floor Study Room B', 'Tomorrow at 4:00 PM', 98),
('swap_102', 'usr_003', 'usr_001', 'Music Production & Mixing', 'Python & Data Science', 'PENDING', 'VIRTUAL', 'Google Meet Link', 'Friday at 2:00 PM', 92);

-- Insert Messages
INSERT INTO messages (id, swap_id, sender_id, sender_name, content) VALUES
('msg_001', 'swap_101', 'usr_002', 'Elena Rostova', 'Hey Sivan! Super excited about this swap. I saw you teach Python for Data Science!'),
('msg_002', 'swap_101', 'usr_001', 'Sivan Ambi', 'Hi Elena! Yes, absolutely. I am looking forward to practicing Spanish in return!'),
('msg_003', 'swap_101', 'usr_002', 'Elena Rostova', 'Awesome! Green Library study room B works great for tomorrow at 4 PM.');

-- Insert Reviews
INSERT INTO reviews (id, swap_id, reviewer_id, reviewer_name, reviewer_avatar, reviewee_id, rating, comment) VALUES
('rev_001', 'swap_101', 'usr_002', 'Elena Rostova', 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=250', 'usr_001', 5, 'Punctual, friendly, and very structured approach to teaching code. Highly recommended campus swap partner!');
