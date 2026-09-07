-- ============================================================================
-- synaptiCITY Database Schema for Supabase/PostgreSQL
-- Run this in your Supabase SQL Editor or PostgreSQL instance
-- ============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- USERS TABLE (Supabase Auth handles this, but we extend it)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  display_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  level INTEGER DEFAULT 1,
  total_xp INTEGER DEFAULT 0,
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  networks_created INTEGER DEFAULT 0,
  networks_shared INTEGER DEFAULT 0,
  achievements_unlocked INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- NETWORKS TABLE (User-created neural networks)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.networks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  vocabulary TEXT[] NOT NULL,
  weights JSONB NOT NULL,
  learning_rate FLOAT NOT NULL DEFAULT 0.1,
  learning_rule TEXT NOT NULL DEFAULT 'hebbian',
  is_public BOOLEAN DEFAULT true,
  allow_derivatives BOOLEAN DEFAULT true,
  likes_count INTEGER DEFAULT 0,
  downloads_count INTEGER DEFAULT 0,
  views_count INTEGER DEFAULT 0,
  tags TEXT[] DEFAULT '{}',
  thumbnail_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- ACHIEVEMENTS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  tier TEXT NOT NULL,
  icon TEXT NOT NULL,
  xp INTEGER NOT NULL,
  target INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- USER ACHIEVEMENTS (Many-to-Many)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.user_achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  achievement_id UUID REFERENCES public.achievements(id) ON DELETE CASCADE,
  progress INTEGER DEFAULT 0,
  unlocked BOOLEAN DEFAULT false,
  unlocked_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, achievement_id)
);

-- ============================================================================
-- NETWORK LIKES
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.network_likes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  network_id UUID REFERENCES public.networks(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, network_id)
);

-- ============================================================================
-- NETWORK COMMENTS
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.network_comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  network_id UUID REFERENCES public.networks(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  parent_id UUID REFERENCES public.network_comments(id) ON DELETE CASCADE,
  likes_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- LEADERBOARD ENTRIES
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.leaderboard (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  timeframe TEXT NOT NULL, -- 'all_time', 'monthly', 'weekly'
  rank INTEGER NOT NULL,
  score INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, timeframe)
);

-- ============================================================================
-- ACTIVITY LOG
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.activity_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  action TEXT NOT NULL, -- 'create_network', 'like_network', 'achievement_unlocked', etc.
  resource_type TEXT,
  resource_id UUID,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- INDEXES for Performance
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_networks_user_id ON public.networks(user_id);
CREATE INDEX IF NOT EXISTS idx_networks_public ON public.networks(is_public) WHERE is_public = true;
CREATE INDEX IF NOT EXISTS idx_networks_created_at ON public.networks(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_networks_likes_count ON public.networks(likes_count DESC);
CREATE INDEX IF NOT EXISTS idx_networks_tags ON public.networks USING GIN(tags);

CREATE INDEX IF NOT EXISTS idx_user_achievements_user_id ON public.user_achievements(user_id);
CREATE INDEX IF NOT EXISTS idx_user_achievements_unlocked ON public.user_achievements(unlocked) WHERE unlocked = true;

CREATE INDEX IF NOT EXISTS idx_network_likes_user_id ON public.network_likes(user_id);
CREATE INDEX IF NOT EXISTS idx_network_likes_network_id ON public.network_likes(network_id);

CREATE INDEX IF NOT EXISTS idx_activity_log_user_id ON public.activity_log(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_log_created_at ON public.activity_log(created_at DESC);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) Policies
-- ============================================================================

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.networks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.network_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.network_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_log ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can read all profiles, but only update their own
CREATE POLICY "Public profiles are viewable by everyone"
  ON public.profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Networks: Public networks viewable by all, private only by owner
CREATE POLICY "Public networks are viewable by everyone"
  ON public.networks FOR SELECT
  USING (is_public = true OR auth.uid() = user_id);

CREATE POLICY "Users can insert own networks"
  ON public.networks FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own networks"
  ON public.networks FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own networks"
  ON public.networks FOR DELETE
  USING (auth.uid() = user_id);

-- User Achievements: Users can only view and update their own
CREATE POLICY "Users can view own achievements"
  ON public.user_achievements FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own achievements"
  ON public.user_achievements FOR UPDATE
  USING (auth.uid() = user_id);

-- Network Likes: Users can view all, insert/delete their own
CREATE POLICY "Likes are viewable by everyone"
  ON public.network_likes FOR SELECT
  USING (true);

CREATE POLICY "Users can like networks"
  ON public.network_likes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can unlike networks"
  ON public.network_likes FOR DELETE
  USING (auth.uid() = user_id);

-- Network Comments: Public comments viewable by all
CREATE POLICY "Comments are viewable by everyone"
  ON public.network_comments FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can comment"
  ON public.network_comments FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own comments"
  ON public.network_comments FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own comments"
  ON public.network_comments FOR DELETE
  USING (auth.uid() = user_id);

-- Activity Log: Users can only view their own activity
CREATE POLICY "Users can view own activity"
  ON public.activity_log FOR SELECT
  USING (auth.uid() = user_id);

-- ============================================================================
-- TRIGGERS for Automatic Timestamps
-- ============================================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply triggers
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_networks_updated_at
  BEFORE UPDATE ON public.networks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_network_comments_updated_at
  BEFORE UPDATE ON public.network_comments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- FUNCTIONS for Counters and Stats
-- ============================================================================

-- Function to increment network likes
CREATE OR REPLACE FUNCTION increment_network_likes()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.networks
  SET likes_count = likes_count + 1
  WHERE id = NEW.network_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_network_like
  AFTER INSERT ON public.network_likes
  FOR EACH ROW EXECUTE FUNCTION increment_network_likes();

-- Function to decrement network likes
CREATE OR REPLACE FUNCTION decrement_network_likes()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.networks
  SET likes_count = likes_count - 1
  WHERE id = OLD.network_id;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_network_unlike
  AFTER DELETE ON public.network_likes
  FOR EACH ROW EXECUTE FUNCTION decrement_network_likes();

-- ============================================================================
-- SEED DATA for Achievements
-- ============================================================================

INSERT INTO public.achievements (code, name, description, category, tier, icon, xp, target) VALUES
  ('first_teach', 'First Steps', 'Complete your first teaching session', 'teaching', 'bronze', '🎯', 10, 1),
  ('teach_10', 'Teacher', 'Complete 10 teaching sessions', 'teaching', 'silver', '📚', 50, 10),
  ('teach_50', 'Educator', 'Complete 50 teaching sessions', 'teaching', 'gold', '🎓', 200, 50),
  ('teach_100', 'Professor', 'Complete 100 teaching sessions', 'teaching', 'platinum', '👨‍🏫', 500, 100),
  
  ('first_recall', 'Memory Lane', 'Successfully recall your first association', 'recall', 'bronze', '🧠', 10, 1),
  ('recall_perfect', 'Perfect Memory', 'Achieve 100% recall accuracy on a network', 'recall', 'silver', '✨', 100, 1),
  ('recall_50', 'Memory Master', 'Complete 50 successful recalls', 'recall', 'gold', '🎯', 250, 50),
  ('recall_streak', 'On Fire!', 'Maintain a 7-day learning streak', 'recall', 'platinum', '🔥', 300, 7),
  
  ('first_network', 'Network Builder', 'Create your first custom network', 'network', 'bronze', '🏗️', 25, 1),
  ('network_large', 'Scale Master', 'Create a network with 20+ nodes', 'network', 'gold', '⚡', 150, 1),
  
  ('explore_3d', 'Third Dimension', 'View network in 3D visualization', 'exploration', 'bronze', '🌐', 15, 1),
  ('try_all_rules', 'Rule Explorer', 'Try all 4 learning rules', 'exploration', 'silver', '🔬', 75, 4),
  ('challenge_complete', 'Challenge Accepted', 'Complete your first challenge', 'exploration', 'gold', '🏆', 100, 1),
  
  ('share_network', 'Community Member', 'Share your first network', 'mastery', 'silver', '🌟', 50, 1),
  ('level_10', 'Expert', 'Reach level 10', 'mastery', 'gold', '💎', 500, 1),
  ('all_achievements', 'Completionist', 'Unlock all other achievements', 'mastery', 'platinum', '👑', 1000, 15)
ON CONFLICT (code) DO NOTHING;

-- ============================================================================
-- VIEWS for Common Queries
-- ============================================================================

-- Popular networks view
CREATE OR REPLACE VIEW public.popular_networks AS
SELECT 
  n.*,
  p.username,
  p.display_name,
  p.avatar_url
FROM public.networks n
JOIN public.profiles p ON n.user_id = p.id
WHERE n.is_public = true
ORDER BY n.likes_count DESC, n.created_at DESC;

-- Recent networks view
CREATE OR REPLACE VIEW public.recent_networks AS
SELECT 
  n.*,
  p.username,
  p.display_name,
  p.avatar_url
FROM public.networks n
JOIN public.profiles p ON n.user_id = p.id
WHERE n.is_public = true
ORDER BY n.created_at DESC;

-- Leaderboard view (all time)
CREATE OR REPLACE VIEW public.top_users AS
SELECT 
  p.*,
  COUNT(DISTINCT n.id) as network_count,
  SUM(n.likes_count) as total_likes
FROM public.profiles p
LEFT JOIN public.networks n ON p.id = n.user_id AND n.is_public = true
GROUP BY p.id
ORDER BY p.total_xp DESC, p.level DESC
LIMIT 100;
