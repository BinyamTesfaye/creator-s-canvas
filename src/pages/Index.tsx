import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { HeroSection } from "@/components/HeroSection";
import { AboutSection } from "@/components/AboutSection";
import { FeaturedProducts } from "@/components/FeaturedProducts";
import { FeaturedJournal } from "@/components/FeaturedJournal";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <HeroSection />
        <AboutSection />
        <FeaturedProducts />
        <FeaturedJournal />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
