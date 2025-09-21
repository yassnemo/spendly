import { useState, useCallback, useMemo } from "react";
import { AuthModal } from "@/components/AuthModal";
import { NavigationSection } from "./landing/NavigationSection";
import { HeroSection } from "./landing/HeroSection";
import { HowItWorksSection } from "./landing/HowItWorksSection";
import { FooterSection } from "./landing/FooterSection";
import { BackToTopButton } from "@/components/ui/back-to-top";

export const LandingPage = () => {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"signin" | "signup">("signin");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = useMemo(() => [
    { name: "Home", link: "#home" },
    { name: "How It Works", link: "#how-it-works" }
  ], []);

  // Event handlers
  const openAuthModal = useCallback((mode: "signin" | "signup") => {
    setAuthMode(mode);
    setAuthModalOpen(true);
  }, []);

  const handleSignIn = useCallback(() => openAuthModal("signin"), [openAuthModal]);
  const handleSignUp = useCallback(() => openAuthModal("signup"), [openAuthModal]);

  return (
    <div className="min-h-screen bg-deep-space text-white">
      <NavigationSection
        navItems={navItems}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
        onSignIn={handleSignIn}
        onSignUp={handleSignUp}
      />

      <HeroSection
        onSignUp={handleSignUp}
        onSignIn={handleSignIn}
      />

      <HowItWorksSection />

      <FooterSection />

      <AuthModal 
        isOpen={authModalOpen} 
        onClose={() => setAuthModalOpen(false)}
        defaultMode={authMode}
      />
      
      {/* Back to Top Button */}
      <BackToTopButton />
    </div>
  );
};
