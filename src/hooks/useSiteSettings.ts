import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface SiteSettings {
  id: string;
  profile_image_url: string | null;
  logo_url: string | null;
  artist_name: string;
  tagline: string;
  bio: string;
  about_text: string | null;
  telegram_bot_token: string | null;
  telegram_chat_id: string | null;
  created_at: string;
  updated_at: string;
}

export function useSiteSettings() {
  return useQuery({
    queryKey: ["site-settings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("site_settings")
        .select("*")
        .single();
      
      if (error) throw error;
      return data as SiteSettings;
    },
  });
}

export function useUpdateSiteSettings() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (updates: Partial<SiteSettings>) => {
      const { data, error } = await supabase
        .from("site_settings")
        .update(updates)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["site-settings"] });
    },
  });
}
