import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Pencil, Trash2, Eye, EyeOff, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import {
  useJournalPosts,
  useCreateJournalPost,
  useUpdateJournalPost,
  useDeleteJournalPost,
  type JournalPost,
} from "@/hooks/useJournal";
import { format } from "date-fns";

const emptyPost = {
  title: "",
  content: "",
  excerpt: "",
  image_url: "",
  is_published: false,
  published_at: null as string | null,
};

const AdminJournal = () => {
  const { data: posts, isLoading } = useJournalPosts(false);
  const createPost = useCreateJournalPost();
  const updatePost = useUpdateJournalPost();
  const deletePost = useDeleteJournalPost();

  const [isOpen, setIsOpen] = useState(false);
  const [editing, setEditing] = useState<JournalPost | null>(null);
  const [form, setForm] = useState(emptyPost);
  const [uploading, setUploading] = useState(false);

  const openNew = () => {
    setEditing(null);
    setForm(emptyPost);
    setIsOpen(true);
  };

  const openEdit = (post: JournalPost) => {
    setEditing(post);
    setForm({
      title: post.title,
      content: post.content,
      excerpt: post.excerpt || "",
      image_url: post.image_url || "",
      is_published: post.is_published,
      published_at: post.published_at,
    });
    setIsOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const ext = file.name.split(".").pop();
    const path = `${crypto.randomUUID()}.${ext}`;

    const { error } = await supabase.storage.from("journal").upload(path, file);
    if (error) {
      toast.error("Failed to upload image");
      setUploading(false);
      return;
    }

    const { data: urlData } = supabase.storage.from("journal").getPublicUrl(path);
    setForm((f) => ({ ...f, image_url: urlData.publicUrl }));
    setUploading(false);
    toast.success("Image uploaded");
  };

  const handleSave = async () => {
    if (!form.title.trim() || !form.content.trim()) {
      toast.error("Title and content are required");
      return;
    }

    const payload = {
      title: form.title,
      content: form.content,
      excerpt: form.excerpt || null,
      image_url: form.image_url || null,
      is_published: form.is_published,
      published_at: form.is_published
        ? form.published_at || new Date().toISOString()
        : null,
    };

    try {
      if (editing) {
        await updatePost.mutateAsync({ id: editing.id, ...payload });
        toast.success("Post updated");
      } else {
        await createPost.mutateAsync(payload);
        toast.success("Post created");
      }
      setIsOpen(false);
    } catch {
      toast.error("Failed to save post");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this post?")) return;
    try {
      await deletePost.mutateAsync(id);
      toast.success("Post deleted");
    } catch {
      toast.error("Failed to delete post");
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold">Journal</h1>
          <p className="text-muted-foreground text-sm">Share your thoughts and stories</p>
        </div>
        <Button onClick={openNew} className="gap-2">
          <Plus className="w-4 h-4" /> New Post
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse bg-muted rounded-lg h-20" />
          ))}
        </div>
      ) : !posts?.length ? (
        <div className="text-center py-16 text-muted-foreground">
          <p>No journal posts yet. Create your first one!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {posts.map((post) => (
            <div
              key={post.id}
              className="flex items-center gap-4 p-4 bg-card rounded-lg border border-border"
            >
              {post.image_url ? (
                <img
                  src={post.image_url}
                  alt={post.title}
                  className="w-16 h-16 rounded-lg object-cover shrink-0"
                />
              ) : (
                <div className="w-16 h-16 rounded-lg bg-muted flex items-center justify-center shrink-0">
                  <ImageIcon className="w-6 h-6 text-muted-foreground" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <h3 className="font-medium truncate">{post.title}</h3>
                <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                  <span className={`flex items-center gap-1 ${post.is_published ? "text-green-600" : ""}`}>
                    {post.is_published ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                    {post.is_published ? "Published" : "Draft"}
                  </span>
                  <span>{format(new Date(post.created_at), "MMM d, yyyy")}</span>
                </div>
              </div>
              <div className="flex gap-2 shrink-0">
                <Button variant="ghost" size="icon" onClick={() => openEdit(post)}>
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => handleDelete(post.id)}>
                  <Trash2 className="w-4 h-4 text-destructive" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create/Edit Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Post" : "New Post"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div>
              <Label>Title</Label>
              <Input
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                placeholder="Post title"
              />
            </div>

            <div>
              <Label>Excerpt (short preview)</Label>
              <Input
                value={form.excerpt}
                onChange={(e) => setForm((f) => ({ ...f, excerpt: e.target.value }))}
                placeholder="A brief summary..."
              />
            </div>

            <div>
              <Label>Cover Image</Label>
              <div className="flex items-center gap-3 mt-1">
                {form.image_url && (
                  <img src={form.image_url} alt="Cover" className="w-20 h-20 rounded-lg object-cover" />
                )}
                <label className="cursor-pointer">
                  <Button variant="outline" size="sm" asChild disabled={uploading}>
                    <span>{uploading ? "Uploading..." : "Upload Image"}</span>
                  </Button>
                  <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                </label>
              </div>
            </div>

            <div>
              <Label>Content</Label>
              <Textarea
                value={form.content}
                onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
                placeholder="Write your thoughts..."
                rows={10}
              />
            </div>

            <div className="flex items-center gap-3">
              <Switch
                checked={form.is_published}
                onCheckedChange={(checked) => setForm((f) => ({ ...f, is_published: checked }))}
              />
              <Label>Publish immediately</Label>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Button variant="outline" onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={createPost.isPending || updatePost.isPending}>
                {editing ? "Update" : "Create"} Post
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default AdminJournal;
