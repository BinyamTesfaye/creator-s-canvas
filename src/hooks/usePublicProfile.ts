import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const ARTIST_USER_ID = "caec099c-4494-45e1-a8bb-b98594c9bd48";

export const usePublicProfile = () => {
  return useQuery({
    queryKey: ["public-profile"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", ARTIST_USER_ID)
        .single();

      if (error) throw error;
      return data;
    },
  });
};