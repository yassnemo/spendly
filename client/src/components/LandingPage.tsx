import { useState } from "react";
import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/glass-card";
import { MagneticButton } from "@/components/ui/magnetic-button";
import { AnimatedCounter } from "@/components/ui/animated-counter";
import { TextHoverEffect } from "@/components/ui/text-hover-effect";
import { 
  Navbar, 
  NavBody, 
  NavItems, 
  MobileNav, 
  MobileNavHeader, 
  MobileNavMenu, 
  MobileNavToggle, 
  NavbarLogo, 
  NavbarButton 
} from "@/components/ui/resizable-navbar";
import { AuthModal } from "@/components/AuthModal";
import { Upload, BarChart3, DollarSign, CheckCircle, Star, Home, Info, CreditCard } from "lucide-react";

export const LandingPage = () => {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"signin" | "signup">("signin");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const openAuthModal = (mode: "signin" | "signup") => {
    setAuthMode(mode);
    setAuthModalOpen(true);
  };

  const navItems = [
    { name: "Home", link: "#home" },
    { name: "Features", link: "#features" },
    { name: "Pricing", link: "#pricing" },
    { name: "About", link: "#about" }
  ];

  return (
    <div className="min-h-screen bg-deep-space text-white">
      {/* Navigation */}
      <Navbar>
        <NavBody>
          <NavbarLogo />
          <NavItems items={navItems} />
          <div className="flex items-center space-x-4">
            <NavbarButton 
              as="button" 
              variant="secondary"
              onClick={() => openAuthModal("signin")}
            >
              Sign In
            </NavbarButton>
            <NavbarButton 
              as="button"
              onClick={() => openAuthModal("signup")}
            >
              Get Started
            </NavbarButton>
          </div>
        </NavBody>
        <MobileNav>
          <MobileNavHeader>
            <NavbarLogo />
            <MobileNavToggle 
              isOpen={isMobileMenuOpen} 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
            />
          </MobileNavHeader>
          <MobileNavMenu 
            isOpen={isMobileMenuOpen} 
            onClose={() => setIsMobileMenuOpen(false)}
          >
            {navItems.map((item, idx) => (
              <a
                key={idx}
                href={item.link}
                className="w-full px-4 py-2 text-gray-300 hover:text-white transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.name}
              </a>
            ))}
            <div className="flex flex-col space-y-2 w-full pt-4 border-t border-white/20">
              <NavbarButton 
                as="button" 
                variant="secondary"
                onClick={() => {
                  openAuthModal("signin");
                  setIsMobileMenuOpen(false);
                }}
                className="w-full"
              >
                Sign In
              </NavbarButton>
              <NavbarButton 
                as="button"
                onClick={() => {
                  openAuthModal("signup");
                  setIsMobileMenuOpen(false);
                }}
                className="w-full"
              >
                Get Started
              </NavbarButton>
            </div>
          </MobileNavMenu>
        </MobileNav>
      </Navbar>

      {/* Hero Section */}
      <section id="home" className="pt-32 pb-20 px-6">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div 
              className="space-y-8"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="space-y-6">
                <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                  Take Control of Your{" "}
                  <span className="bg-gradient-to-r from-coral to-teal bg-clip-text text-transparent">
                    Financial Future
                  </span>
                </h1>
                <p className="text-xl text-gray-300 leading-relaxed">
                  Smart budgeting • Expense tracking • AI-powered insights
                </p>
                <p className="text-lg text-gray-400">
                  Upload your bank statements and let our AI categorize your expenses, 
                  track your budgets, and help you save more money.
                </p>
                
                {/* Test Text Hover Effect */}
                <div className="py-4">
                  <div className="text-2xl font-semibold text-gray-500">
                    <TextHoverEffect 
                      text="TRACK • SAVE • GROW" 
                    />
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <MagneticButton 
                  onClick={() => openAuthModal("signup")}
                  className="px-8 py-4 rounded-full text-lg"
                >
                  Get Started Free
                </MagneticButton>
                <MagneticButton 
                  variant="secondary"
                  className="px-8 py-4 rounded-full text-lg"
                >
                  Watch Demo ▶
                </MagneticButton>
              </div>
              
              <div className="flex items-center space-x-6 pt-4">
                <div className="text-sm text-gray-400 flex items-center">
                  <CheckCircle className="w-4 h-4 text-mint mr-2" />
                  No credit card required
                </div>
                <div className="text-sm text-gray-400 flex items-center">
                  <CheckCircle className="w-4 h-4 text-mint mr-2" />
                  Bank-grade security
                </div>
                <div className="text-sm text-gray-400 flex items-center">
                  <CheckCircle className="w-4 h-4 text-mint mr-2" />
                  30-day free trial
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              className="relative"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 6, repeat: Infinity }}
              >
                <GlassCard className="p-6 shadow-2xl">
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-semibold">Dashboard Preview</h3>
                      <div className="flex space-x-2">
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <GlassCard className="p-4" hover={false}>
                        <div className="text-sm text-gray-400">Total Balance</div>
                        <div className="text-2xl font-bold text-mint">
                          <AnimatedCounter value={12847} prefix="$" />
                        </div>
                      </GlassCard>
                      <GlassCard className="p-4" hover={false}>
                        <div className="text-sm text-gray-400">Monthly Budget</div>
                        <div className="text-2xl font-bold text-coral">
                          <AnimatedCounter value={3200} prefix="$" />
                        </div>
                      </GlassCard>
                    </div>
                    
                    <GlassCard className="p-4" hover={false}>
                      <div className="text-sm text-gray-400 mb-2">Spending This Month</div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <motion.div 
                          className="bg-gradient-to-r from-coral to-teal h-2 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: "68%" }}
                          transition={{ duration: 2, delay: 1 }}
                        />
                      </div>
                      <div className="text-xs text-gray-400 mt-1">$2,176 of $3,200</div>
                    </GlassCard>
                  </div>
                </GlassCard>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6">
        <div className="container mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold mb-4">Powerful Features for Smart Money Management</h2>
            <p className="text-xl text-gray-300">Everything you need to take control of your finances</p>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Upload,
                title: "Smart CSV Upload",
                description: "Upload bank statements from any bank. Our AI automatically detects and categorizes your transactions."
              },
              {
                icon: BarChart3,
                title: "Interactive Analytics",
                description: "Beautiful charts and insights help you understand your spending patterns and identify opportunities to save."
              },
              {
                icon: DollarSign,
                title: "Budget Tracking",
                description: "Set budgets for different categories and get real-time alerts when you're approaching your limits."
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
              >
                <GlassCard className="p-8 text-center space-y-6 h-full">
                  <motion.div 
                    className="w-16 h-16 bg-gradient-to-r from-coral to-teal rounded-2xl flex items-center justify-center mx-auto"
                    animate={{ 
                      boxShadow: [
                        "0 0 20px rgba(255, 107, 107, 0.3)",
                        "0 0 30px rgba(255, 107, 107, 0.6)",
                        "0 0 20px rgba(255, 107, 107, 0.3)"
                      ]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <feature.icon className="w-8 h-8 text-white" />
                  </motion.div>
                  <h3 className="text-2xl font-semibold">{feature.title}</h3>
                  <p className="text-gray-300">{feature.description}</p>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <GlassCard className="p-12 text-center">
              <div className="grid md:grid-cols-3 gap-8 mb-12">
                <div className="space-y-2">
                  <div className="text-4xl font-bold text-mint">
                    <AnimatedCounter value={10000} suffix="+" />
                  </div>
                  <div className="text-gray-300">Active Users</div>
                </div>
                <div className="space-y-2">
                  <div className="text-4xl font-bold text-coral">
                    <AnimatedCounter value={2.5} prefix="$" suffix="M+" />
                  </div>
                  <div className="text-gray-300">Money Saved</div>
                </div>
                <div className="space-y-2">
                  <div className="text-4xl font-bold text-teal">
                    <AnimatedCounter value={4.9} suffix="/5" />
                  </div>
                  <div className="text-gray-300">User Rating</div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-6 h-6 text-electric-yellow fill-current" />
                  ))}
                </div>
                <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                  "Spendly helped me save $3,000 in just 6 months by showing me exactly where my money was going."
                </p>
                <p className="text-sm text-gray-400">- Sarah M., Verified User</p>
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </section>

      {/* Text Hover Effect Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto">
          <motion.div 
            className="text-center mb-8"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <p className="text-lg text-gray-400 mb-4">Hover over the text below to see the magic ✨</p>
            <div className="h-32 flex items-center justify-center">
              <div className="w-full max-w-2xl">
                <TextHoverEffect 
                  text="SAVE MONEY" 
                  duration={0.3}
                />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto text-center">
          <motion.div 
            className="space-y-8"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold">Ready to Transform Your Finances?</h2>
            <p className="text-xl text-gray-300">Join thousands of users who are already saving money with Spendly</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <MagneticButton 
                onClick={() => openAuthModal("signup")}
                className="px-8 py-4 rounded-full text-lg"
              >
                Start Free Trial
              </MagneticButton>
              <MagneticButton 
                variant="secondary"
                className="px-8 py-4 rounded-full text-lg"
              >
                Schedule Demo
              </MagneticButton>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-white/10">
        <div className="container mx-auto">
          <div className="text-center text-gray-400">
            <p className="text-sm">
              Built with ❤️ by{" "}
              <a 
                href="https://yerradouani.me" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-coral hover:text-coral/80 font-medium transition-colors"
              >
                Yassine Erradouani
              </a>
            </p>
            <p className="text-xs mt-1">© 2025 Spendly. All rights reserved.</p>
          </div>
        </div>
      </footer>

      <AuthModal 
        isOpen={authModalOpen} 
        onClose={() => setAuthModalOpen(false)}
        defaultMode={authMode}
      />
    </div>
  );
};
