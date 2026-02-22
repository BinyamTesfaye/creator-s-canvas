
-- Create a public view for site_settings that excludes sensitive Telegram credentials
CREATE VIEW public.site_settings_public
WITH (security_invoker = on) AS
SELECT 
  id,
  profile_image_url,
  logo_url,
  artist_name,
  tagline,
  bio,
  about_text,
  created_at,
  updated_at
FROM public.site_settings;

-- Drop the existing public SELECT policy that exposes everything
DROP POLICY IF EXISTS "Anyone can view site settings" ON public.site_settings;

-- Create a restrictive policy: only admins can SELECT from the base table
CREATE POLICY "Only admins can read site settings"
ON public.site_settings
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));
