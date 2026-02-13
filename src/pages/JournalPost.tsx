import { motion } from "framer-motion";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Calendar } from "lucide-react";
import { format } from "date-fns";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useJournalPost } from "@/hooks/useJournal";

const JournalPost = () => {
  const { id } = useParams<{ id: string }>();
  const { data: post, isLoading } = useJournalPost(id || "");

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-24 pb-16">
        <div className="artistic-container max-w-3xl">
          <Link
            to="/journal"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Journal
          </Link>

          {isLoading ? (
            <div className="animate-pulse space-y-4">
              <div className="bg-muted h-8 rounded w-3/4" />
              <div className="bg-muted h-4 rounded w-1/4" />
              <div className="bg-muted rounded-xl h-72 mt-6" />
              <div className="space-y-2 mt-6">
                <div className="bg-muted h-4 rounded w-full" />
                <div className="bg-muted h-4 rounded w-full" />
                <div className="bg-muted h-4 rounded w-5/6" />
              </div>
            </div>
          ) : !post ? (
            <div className="text-center py-20 text-muted-foreground">
              <p className="text-lg">Post not found.</p>
            </div>
          ) : (
            <motion.article
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <h1 className="font-display text-3xl md:text-4xl font-semibold">
                {post.title}
              </h1>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="w-4 h-4" />
                {post.published_at
                  ? format(new Date(post.published_at), "MMMM d, yyyy")
                  : format(new Date(post.created_at), "MMMM d, yyyy")}
              </div>

              {post.image_url && (
                <div className="rounded-xl overflow-hidden">
                  <img
                    src={post.image_url}
                    alt={post.title}
                    className="w-full object-cover max-h-[500px]"
                  />
                </div>
              )}

              <div className="prose prose-lg max-w-none text-foreground leading-relaxed whitespace-pre-wrap">
                {post.content}
              </div>
            </motion.article>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default JournalPost;
