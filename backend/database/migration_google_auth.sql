-- Safe Migration for Google Auth
-- Execute this against the live PostgreSQL database.

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='password_hash' AND is_nullable='YES') THEN
        ALTER TABLE users ALTER COLUMN password_hash DROP NOT NULL;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='google_id') THEN
        ALTER TABLE users ADD COLUMN google_id VARCHAR(255) UNIQUE;
        CREATE INDEX idx_users_google_id ON users(google_id);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='profile_completed') THEN
        ALTER TABLE users ADD COLUMN profile_completed BOOLEAN DEFAULT FALSE;
        -- Assume existing users (who were created before Google auth) have complete profiles
        UPDATE users SET profile_completed = TRUE;
    END IF;
END $$;
