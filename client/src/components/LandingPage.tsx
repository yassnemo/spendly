import { useState, useCallback, useMemo, memo } from "react";
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
import { Upload, BarChart3, DollarSign, CheckCircle, Star, Home, Info, CreditCard, TrendingUp, TrendingDown, Plus, Minus } from "lucide-react";

export const LandingPage = () => {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"signin" | "signup">("signin");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Interactive Dashboard State with useCallback for performance
  const [totalBalance, setTotalBalance] = useState(12847);
  const [monthlyBudget] = useState(3200); // Made constant since it doesn't change
  const [currentSpending] = useState(2176); // Made constant since it doesn't change
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Memoized calculations to prevent unnecessary re-renders
  const spendingPercentage = useMemo(() => (currentSpending / monthlyBudget) * 100, [currentSpending, monthlyBudget]);
  
  // Memoized spending categories to prevent recreation on every render
  const spendingCategories = useMemo(() => [
    { name: "Food & Dining", amount: 640, color: "from-red-500 to-red-600", icon: "🍕" },
    { name: "Transportation", amount: 420, color: "from-blue-500 to-blue-600", icon: "🚗" },
    { name: "Shopping", amount: 380, color: "from-purple-500 to-purple-600", icon: "🛍️" },
    { name: "Entertainment", amount: 290, color: "from-green-500 to-green-600", icon: "🎬" },
    { name: "Bills & Utilities", amount: 446, color: "from-yellow-500 to-yellow-600", icon: "💡" },
  ], []);

  // Optimized event handlers with useCallback
  const openAuthModal = useCallback((mode: "signin" | "signup") => {
    setAuthMode(mode);
    setAuthModalOpen(true);
  }, []);

  const addToBalance = useCallback(() => {
    setTotalBalance(prev => prev + 500);
  }, []);

  const subtractFromBalance = useCallback(() => {
    setTotalBalance(prev => Math.max(0, prev - 200));
  }, []);

  const handleCategoryClick = useCallback((categoryName: string) => {
    setSelectedCategory(prev => prev === categoryName ? null : categoryName);
  }, []);

  // Memoized nav items
  const navItems = useMemo(() => [
    { name: "Home", link: "#home" },
    { name: "Features", link: "#features" },
    { name: "Pricing", link: "#pricing" },
    { name: "About", link: "#about" }
  ], []);

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
              {/* Compact Dashboard Preview */}
              <GlassCard className="p-4 shadow-2xl max-w-md mx-auto">
                <div className="space-y-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-semibold">Dashboard</h3>
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    </div>
                  </div>
                  
                  {/* Compact Balance Overview */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="text-center">
                      <div className="text-xs text-gray-400">Balance</div>
                      <div className="text-xl font-bold text-mint flex items-center justify-center gap-1">
                        <AnimatedCounter value={totalBalance} prefix="$" />
                        <div className="flex">
                          <button 
                            onClick={addToBalance}
                            className="p-0.5 rounded bg-green-500/10 hover:bg-green-500/20"
                          >
                            <Plus className="w-2.5 h-2.5 text-green-500" />
                          </button>
                          <button 
                            onClick={subtractFromBalance}
                            className="p-0.5 rounded bg-red-500/10 hover:bg-red-500/20 ml-1"
                          >
                            <Minus className="w-2.5 h-2.5 text-red-500" />
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-center">
                      <div className="text-xs text-gray-400">Budget</div>
                      <div className="text-xl font-bold text-coral">
                        <AnimatedCounter value={monthlyBudget} prefix="$" />
                      </div>
                    </div>
                  </div>
                  
                  {/* Compact Progress */}
                  <div>
                    <div className="flex justify-between text-xs text-gray-400 mb-1">
                      <span>Spent: ${currentSpending.toLocaleString()}</span>
                      <span>{Math.round(spendingPercentage)}%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <motion.div 
                        className="bg-gradient-to-r from-coral to-teal h-2 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${spendingPercentage}%` }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                      />
                    </div>
                  </div>

                  {/* Top 3 Categories Only */}
                  <div>
                    <div className="text-xs text-gray-400 mb-2">Top Categories</div>
                    <div className="space-y-2">
                      {spendingCategories.slice(0, 3).map((category, idx) => (
                        <div
                          key={category.name}
                          className="flex items-center justify-between py-1 px-2 rounded hover:bg-white/5 cursor-pointer transition-colors"
                          onClick={() => handleCategoryClick(category.name)}
                        >
                          <div className="flex items-center space-x-2">
                            <span className="text-sm">{category.icon}</span>
                            <span className="text-xs text-gray-300">{category.name}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-xs font-medium text-white">${category.amount}</span>
                            <div className="w-8 h-1.5 bg-gray-700 rounded-full">
                              <motion.div
                                className={`h-full bg-gradient-to-r ${category.color} rounded-full`}
                                initial={{ width: 0 }}
                                animate={{ width: `${(category.amount / 640) * 100}%` }}
                                transition={{ duration: 0.6, delay: idx * 0.05 }}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </GlassCard>
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
