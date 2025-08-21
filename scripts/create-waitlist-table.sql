-- Create a table to store waitlist users
CREATE TABLE IF NOT EXISTS waitlist_users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create an index on user_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_waitlist_users_user_id ON waitlist_users(user_id);

-- Create an index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_waitlist_users_email ON waitlist_users(email);

-- Enable Row Level Security
ALTER TABLE waitlist_users ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows users to read their own data
CREATE POLICY "Users can view their own waitlist entry" ON waitlist_users
  FOR SELECT USING (auth.uid() = user_id);

-- Create a policy that allows users to insert their own data
CREATE POLICY "Users can insert their own waitlist entry" ON waitlist_users
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create a policy that allows users to update their own data
CREATE POLICY "Users can update their own waitlist entry" ON waitlist_users
  FOR UPDATE USING (auth.uid() = user_id);
