// replace relevant parts of your AdminSettings file with this updated logic
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Save, Loader2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

// Define the Profile type to match your expected schema
type Profile = {
  id: string;
  artist_name: string | null;
  tagline: string | null;
  bio: string | null;
  about_text: string | null;
  profile_image_url: string | null;
  telegram_bot_token: string | null;
  telegram_chat_id: string | null;
  // add any other fields your "profiles" table has
};

const AdminSettings = () => {
  // profile fields
  const [artistName, setArtistName] = useState("");
  const [tagline, setTagline] = useState("");
  const [bio, setBio] = useState("");
  const [aboutText, setAboutText] = useState("");
  const [profileImageUrl, setProfileImageUrl] = useState("");
  const [telegramBotToken, setTelegramBotToken] = useState("");
  const [telegramChatId, setTelegramChatId] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  // Load current user and profile
  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setIsLoading(true);
      const {
        data: { user },
        error: userErr,
      } = await supabase.auth.getUser();

      if (userErr || !user) {
        console.error("No user:", userErr);
        toast.error("You must be signed in to edit settings");
        setIsLoading(false);
        return;
      }
      if (!mounted) return;
      setUserId(user.id);

      const { data: profile, error: profileErr } = await (supabase as any)
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single<Profile>();

      if (profileErr && profileErr.code !== "PGRST116") {
        // ignore "no rows" style error and continue with defaults
        console.error("Profile load error:", profileErr);
        toast.error("Failed to load profile");
      }

      if (profile) {
        setArtistName(profile.artist_name ?? "");
        setTagline(profile.tagline ?? "");
        setBio(profile.bio ?? "");
        setAboutText(profile.about_text ?? "");
        setProfileImageUrl(profile.profile_image_url ?? "");
        setTelegramBotToken(profile.telegram_bot_token ?? "");
        setTelegramChatId(profile.telegram_chat_id ?? "");
      }
      setIsLoading(false);
    };

    load();
    return () => {
      mounted = false;
    };
  }, []);

  // image upload — store per-user path to avoid collisions
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!userId) {
      toast.error("No user logged in");
      return;
    }

    setIsUploading(true);
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `profile.${fileExt}`;
      const filePath = `profiles/${userId}/${fileName}`;

      // optional: remove old file(s) under profiles/userId if you want to clean
      // await supabase.storage.from("site-assets").remove([filePath]);

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

  // upsert profile
  const handleSave = async () => {
    if (!userId) {
      toast.error("No user logged in");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        id: userId,
        artist_name: artistName,
        tagline,
        bio,
        about_text: aboutText,
        profile_image_url: profileImageUrl,
        telegram_bot_token: telegramBotToken,
        telegram_chat_id: telegramChatId,
      };


      const { data, error } = await (supabase as any).from("profiles").upsert(payload, { returning: "representation" }).select().single();

      if (error) throw error;
      toast.success("Profile saved");
    } catch (error) {
      console.error("Save error:", error);
      toast.error("Failed to save profile");
    } finally {
      setSaving(false);
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
          <p className="text-muted-foreground mt-1">Customize your website and configure integrations</p>
        </div>
        <Button onClick={handleSave} disabled={saving} className="gap-2">
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Save Changes
        </Button>
      </div>

      {/* Profile Settings (unchanged visual structure) */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-card rounded-xl border border-border p-6 shadow-soft space-y-6">
        <h2 className="font-display text-xl font-semibold">Profile</h2>

        <div className="space-y-3">
          <Label>Profile Image</Label>
          <div className="flex items-center gap-4">
            {profileImageUrl ? (
              <img src={profileImageUrl} alt="Profile" className="w-20 h-20 rounded-full object-cover border-2 border-border" />
            ) : (
              <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center">
                <Upload className="w-6 h-6 text-muted-foreground" />
              </div>
            )}
            <div className="flex-1">
              <Input type="file" accept="image/*" onChange={handleImageUpload} disabled={isUploading} />
              {isUploading && (
                <p className="text-sm text-muted-foreground mt-1 flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" /> Uploading...
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="name">Artist Name</Label>
          <Input id="name" value={artistName} onChange={(e) => setArtistName(e.target.value)} placeholder="Your name" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="tagline">Tagline</Label>
          <Input id="tagline" value={tagline} onChange={(e) => setTagline(e.target.value)} placeholder="A short tagline" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="bio">Short Bio (Hero Section)</Label>
          <Textarea id="bio" value={bio} onChange={(e) => setBio(e.target.value)} placeholder="A brief introduction" rows={2} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="about">About Text (Detailed)</Label>
          <Textarea id="about" value={aboutText} onChange={(e) => setAboutText(e.target.value)} placeholder="Tell your story..." rows={4} />
        </div>
      </motion.div>

      <Separator />

      {/* Telegram Settings */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-card rounded-xl border border-border p-6 shadow-soft space-y-6">
        <div>
          <h2 className="font-display text-xl font-semibold">Telegram Notifications</h2>
          <p className="text-sm text-muted-foreground mt-1">Receive order notifications directly in Telegram</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="botToken">Bot Token</Label>
          <Input id="botToken" type="password" value={telegramBotToken} onChange={(e) => setTelegramBotToken(e.target.value)} placeholder="123456789:ABC..." />
          <p className="text-xs text-muted-foreground">Get this from @BotFather on Telegram</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="chatId">Chat ID</Label>
          <Input id="chatId" value={telegramChatId} onChange={(e) => setTelegramChatId(e.target.value)} placeholder="-123456789" />
          <p className="text-xs text-muted-foreground">Your channel, group, or personal chat ID</p>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminSettings;