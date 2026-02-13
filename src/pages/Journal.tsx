import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Calendar, ArrowRight } from "lucide-react";
import { format } from "date-fns";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useJournalPosts } from "@/hooks/useJournal";

const Journal = () => {
  const { data: posts, isLoading } = useJournalPosts();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-24 pb-16">
        <div className="artistic-container">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="font-display text-4xl md:text-5xl font-semibold mb-4">Journal</h1>
            <p className="text-muted-foreground text-lg max-w-md mx-auto">
              Thoughts, stories, and behind-the-scenes from the studio.
            </p>
          </motion.div>

          {/* Posts Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-muted rounded-xl h-52 mb-4" />
                  <div className="bg-muted h-6 rounded w-3/4 mb-2" />
                  <div className="bg-muted h-4 rounded w-full" />
                </div>
              ))}
            </div>
          ) : !posts?.length ? (
            <div className="text-center py-20 text-muted-foreground">
              <p className="text-lg">No journal entries yet. Check back soon!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post, i) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Link
                    to={`/journal/${post.id}`}
                    className="group block glass-card rounded-xl overflow-hidden hover-lift"
                  >
                    {post.image_url && (
                      <div className="aspect-[16/10] overflow-hidden">
                        <img
                          src={post.image_url}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                    )}
                    <div className="p-5 space-y-3">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Calendar className="w-3.5 h-3.5" />
                        {post.published_at
                          ? format(new Date(post.published_at), "MMM d, yyyy")
                          : format(new Date(post.created_at), "MMM d, yyyy")}
                      </div>
                      <h2 className="font-display text-xl font-semibold group-hover:text-primary transition-colors">
                        {post.title}
                      </h2>
                      {post.excerpt && (
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {post.excerpt}
                        </p>
                      )}
                      <span className="inline-flex items-center gap-1 text-sm text-primary font-medium">
                        Read more <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Journal;
