import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Save, Loader2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useSiteSettings, useUpdateSiteSettings } from "@/hooks/useSiteSettings";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const AdminSettings = () => {
  const { data: settings, isLoading } = useSiteSettings();
  const updateSettings = useUpdateSiteSettings();

  const [artistName, setArtistName] = useState("");
  const [tagline, setTagline] = useState("");
  const [bio, setBio] = useState("");
  const [aboutText, setAboutText] = useState("");
  const [profileImageUrl, setProfileImageUrl] = useState("");
  const [telegramBotToken, setTelegramBotToken] = useState("");
  const [telegramChatId, setTelegramChatId] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (settings) {
      setArtistName(settings.artist_name || "");
      setTagline(settings.tagline || "");
      setBio(settings.bio || "");
      setAboutText(settings.about_text || "");
      setProfileImageUrl(settings.profile_image_url || "");
      setTelegramBotToken(settings.telegram_bot_token || "");
      setTelegramChatId(settings.telegram_chat_id || "");
    }
  }, [settings]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `profile.${fileExt}`;
      const filePath = `site/${fileName}`;

      // Delete old file if exists
      await supabase.storage.from("site-assets").remove([filePath]);

      const { error: uploadError } = await supabase.storage
        .from("site-assets")
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from("site-assets").getPublicUrl(filePath);
      setProfileImageUrl(data.publicUrl + "?t=" + Date.now());
      toast.success("Image uploaded!");
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload image");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = async () => {
    try {
      await updateSettings.mutateAsync({
        artist_name: artistName,
        tagline,
        bio,
        about_text: aboutText,
        profile_image_url: profileImageUrl,
        telegram_bot_token: telegramBotToken,
        telegram_chat_id: telegramChatId,
      });
      toast.success("Settings saved!");
    } catch (error) {
      console.error("Save error:", error);
      toast.error("Failed to save settings");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-semibold">Settings</h1>
          <p className="text-muted-foreground mt-1">
            Customize your website and configure integrations
          </p>
        </div>
        <Button onClick={handleSave} disabled={updateSettings.isPending} className="gap-2">
          {updateSettings.isPending ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          Save Changes
        </Button>
      </div>

      {/* Profile Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card rounded-xl border border-border p-6 shadow-soft space-y-6"
      >
        <h2 className="font-display text-xl font-semibold">Profile</h2>

        {/* Profile Image */}
        <div className="space-y-3">
          <Label>Profile Image</Label>
          <div className="flex items-center gap-4">
            {profileImageUrl ? (
              <img
                src={profileImageUrl}
                alt="Profile"
                className="w-20 h-20 rounded-full object-cover border-2 border-border"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center">
                <Upload className="w-6 h-6 text-muted-foreground" />
              </div>
            )}
            <div className="flex-1">
              <Input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={isUploading}
              />
              {isUploading && (
                <p className="text-sm text-muted-foreground mt-1 flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Uploading...
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="name">Artist Name</Label>
          <Input
            id="name"
            value={artistName}
            onChange={(e) => setArtistName(e.target.value)}
            placeholder="Your name"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="tagline">Tagline</Label>
          <Input
            id="tagline"
            value={tagline}
            onChange={(e) => setTagline(e.target.value)}
            placeholder="A short tagline"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="bio">Short Bio (Hero Section)</Label>
          <Textarea
            id="bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="A brief introduction"
            rows={2}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="about">About Text (Detailed)</Label>
          <Textarea
            id="about"
            value={aboutText}
            onChange={(e) => setAboutText(e.target.value)}
            placeholder="Tell your story..."
            rows={4}
          />
        </div>
      </motion.div>

      <Separator />

      {/* Telegram Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-card rounded-xl border border-border p-6 shadow-soft space-y-6"
      >
        <div>
          <h2 className="font-display text-xl font-semibold">Telegram Notifications</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Receive order notifications directly in Telegram
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="botToken">Bot Token</Label>
          <Input
            id="botToken"
            type="password"
            value={telegramBotToken}
            onChange={(e) => setTelegramBotToken(e.target.value)}
            placeholder="123456789:ABC..."
          />
          <p className="text-xs text-muted-foreground">
            Get this from @BotFather on Telegram
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="chatId">Chat ID</Label>
          <Input
            id="chatId"
            value={telegramChatId}
            onChange={(e) => setTelegramChatId(e.target.value)}
            placeholder="-123456789"
          />
          <p className="text-xs text-muted-foreground">
            Your channel, group, or personal chat ID
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminSettings;
