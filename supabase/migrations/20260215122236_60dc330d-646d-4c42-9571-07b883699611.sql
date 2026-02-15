
-- Add tags column to journal_posts
ALTER TABLE public.journal_posts
ADD COLUMN tags text[] DEFAULT '{}';

-- Add index for better performance on tag queries
CREATE INDEX idx_journal_posts_tags ON public.journal_posts USING GIN(tags);
