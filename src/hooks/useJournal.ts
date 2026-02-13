import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface JournalPost {
  id: string;
  title: string;
  content: string;
  excerpt: string | null;
  image_url: string | null;
  is_published: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export function useJournalPosts(publishedOnly = true) {
  return useQuery({
    queryKey: ["journal-posts", publishedOnly],
    queryFn: async () => {
      let query = supabase
        .from("journal_posts")
        .select("*")
        .order("published_at", { ascending: false, nullsFirst: false });

      if (publishedOnly) {
        query = query.eq("is_published", true);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as JournalPost[];
    },
  });
}

export function useJournalPost(id: string) {
  return useQuery({
    queryKey: ["journal-post", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("journal_posts")
        .select("*")
        .eq("id", id)
        .maybeSingle();
      if (error) throw error;
      return data as JournalPost | null;
    },
    enabled: !!id,
  });
}

export function useCreateJournalPost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (post: Omit<JournalPost, "id" | "created_at" | "updated_at">) => {
      const { data, error } = await supabase
        .from("journal_posts")
        .insert(post)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["journal-posts"] }),
  });
}

export function useUpdateJournalPost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...post }: Partial<JournalPost> & { id: string }) => {
      const { data, error } = await supabase
        .from("journal_posts")
        .update(post)
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["journal-posts"] }),
  });
}

export function useDeleteJournalPost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("journal_posts").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["journal-posts"] }),
  });
}
