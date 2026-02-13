
-- Create journal_posts table
CREATE TABLE public.journal_posts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  image_url TEXT,
  is_published BOOLEAN NOT NULL DEFAULT false,
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.journal_posts ENABLE ROW LEVEL SECURITY;

-- Anyone can view published posts
CREATE POLICY "Anyone can view published journal posts"
  ON public.journal_posts FOR SELECT
  USING (is_published = true);

-- Authenticated users can manage all posts
CREATE POLICY "Authenticated users can manage journal posts"
  ON public.journal_posts FOR ALL
  USING (true)
  WITH CHECK (true);

-- Trigger for updated_at
CREATE TRIGGER update_journal_posts_updated_at
  BEFORE UPDATE ON public.journal_posts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Storage bucket for journal images
INSERT INTO storage.buckets (id, name, public) VALUES ('journal', 'journal', true);

CREATE POLICY "Anyone can view journal images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'journal');

CREATE POLICY "Authenticated users can upload journal images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'journal');

CREATE POLICY "Authenticated users can update journal images"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'journal');

CREATE POLICY "Authenticated users can delete journal images"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'journal');
