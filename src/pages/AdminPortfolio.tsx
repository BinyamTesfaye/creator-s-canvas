import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  useAllPortfolio,
  useCreatePortfolioItem,
  useUpdatePortfolioItem,
  useDeletePortfolioItem,
  PortfolioItem,
} from "@/hooks/usePortfolio";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const AdminPortfolio = () => {
  const { data: items, isLoading } = useAllPortfolio();
  const createItem = useCreatePortfolioItem();
  const updateItem = useUpdatePortfolioItem();
  const deleteItem = useDeletePortfolioItem();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<PortfolioItem | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("general");
  const [isVisible, setIsVisible] = useState(true);
  const [imageUrl, setImageUrl] = useState("");

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setCategory("general");
    setIsVisible(true);
    setImageUrl("");
    setEditingItem(null);
  };

  const openModal = (item?: PortfolioItem) => {
    if (item) {
      setEditingItem(item);
      setTitle(item.title);
      setDescription(item.description || "");
      setCategory(item.category);
      setIsVisible(item.is_visible);
      setImageUrl(item.image_url);
    } else {
      resetForm();
    }
    setIsModalOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `portfolio/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("portfolio")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from("portfolio").getPublicUrl(filePath);
      setImageUrl(data.publicUrl);
      toast.success("Image uploaded!");
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload image");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !imageUrl) {
      toast.error("Please fill in required fields");
      return;
    }

    try {
      const itemData = {
        title,
        description: description || null,
        category,
        is_visible: isVisible,
        image_url: imageUrl,
        display_order: 0,
      };

      if (editingItem) {
        await updateItem.mutateAsync({ id: editingItem.id, ...itemData });
        toast.success("Portfolio item updated!");
      } else {
        await createItem.mutateAsync(itemData);
        toast.success("Portfolio item created!");
      }

      setIsModalOpen(false);
      resetForm();
    } catch (error) {
      console.error("Save error:", error);
      toast.error("Failed to save portfolio item");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this item?")) return;

    try {
      await deleteItem.mutateAsync(id);
      toast.success("Portfolio item deleted!");
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to delete item");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-semibold">Portfolio</h1>
          <p className="text-muted-foreground mt-1">
            Manage your portfolio gallery
          </p>
        </div>
        <Button onClick={() => openModal()} className="gap-2">
          <Plus className="w-4 h-4" />
          Add Item
        </Button>
      </div>

      {/* Portfolio Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="aspect-square bg-muted rounded-xl animate-pulse"
            />
          ))}
        </div>
      ) : items && items.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="group relative bg-card rounded-xl border border-border overflow-hidden shadow-soft"
            >
              <div className="aspect-square relative">
                <img
                  src={item.image_url}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
                {!item.is_visible && (
                  <div className="absolute top-2 right-2 bg-destructive text-destructive-foreground text-xs px-2 py-1 rounded">
                    Hidden
                  </div>
                )}
                <div className="absolute inset-0 bg-foreground/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => openModal(item)}
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(item.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold truncate">{item.title}</h3>
                <p className="text-sm text-muted-foreground capitalize">
                  {item.category}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-card rounded-xl border border-border">
          <p className="text-muted-foreground">
            No portfolio items yet. Add your first artwork!
          </p>
        </div>
      )}

      {/* Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-display text-xl">
              {editingItem ? "Edit Portfolio Item" : "Add Portfolio Item"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter title"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your artwork"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="e.g., illustrations, sketches, paintings"
              />
            </div>

            <div className="space-y-2">
              <Label>Image *</Label>
              {imageUrl && (
                <img
                  src={imageUrl}
                  alt="Preview"
                  className="w-full h-40 object-cover rounded-lg"
                />
              )}
              <Input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={isUploading}
              />
              {isUploading && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Uploading...
                </div>
              )}
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="visible">Visible on website</Label>
              <Switch
                id="visible"
                checked={isVisible}
                onCheckedChange={setIsVisible}
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1"
                disabled={createItem.isPending || updateItem.isPending}
              >
                {(createItem.isPending || updateItem.isPending) ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : editingItem ? (
                  "Update"
                ) : (
                  "Create"
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminPortfolio;
