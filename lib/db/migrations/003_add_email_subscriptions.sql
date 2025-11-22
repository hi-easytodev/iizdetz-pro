-- Migration: Add email subscriptions
-- Date: 2025-11-22
-- Purpose: Email notifications for new ideas

-- Add email preferences to users table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'users' AND column_name = 'email_notifications'
  ) THEN
    ALTER TABLE users ADD COLUMN email_notifications BOOLEAN DEFAULT true;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'users' AND column_name = 'notification_frequency'
  ) THEN
    ALTER TABLE users ADD COLUMN notification_frequency VARCHAR(20) DEFAULT 'daily'
      CHECK (notification_frequency IN ('daily', 'weekly', 'never'));
  END IF;
END $$;

-- Table for tracking sent notifications
CREATE TABLE IF NOT EXISTS email_notifications (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL,
  type VARCHAR(50) NOT NULL CHECK (type IN ('new_ideas', 'analysis_complete', 'weekly_digest')),
  ideas_count INTEGER,
  sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  status VARCHAR(50) DEFAULT 'sent' CHECK (status IN ('sent', 'failed', 'bounced'))
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_email_notifications_user_id ON email_notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_email_notifications_type ON email_notifications(type);
CREATE INDEX IF NOT EXISTS idx_email_notifications_sent_at ON email_notifications(sent_at DESC);

-- Function to get users who should receive notifications
CREATE OR REPLACE FUNCTION get_users_for_notifications(notification_type VARCHAR DEFAULT 'daily')
RETURNS TABLE (
  id INTEGER,
  email VARCHAR(255),
  name VARCHAR(255)
) AS $$
BEGIN
  RETURN QUERY
  SELECT u.id, u.email, u.name
  FROM users u
  WHERE u.email_notifications = true
    AND u.notification_frequency = notification_type
    AND u.email IS NOT NULL;
END;
$$ LANGUAGE plpgsql;
