import { memo } from "react";
import { motion } from "framer-motion";
import { Upload, Brain, BarChart3, Target } from "lucide-react";
import { StarBorder } from "@/components/ui/StarBorder";
import { MagneticButton } from "@/components/ui/magnetic-button";

const steps = [
  {
    icon: Upload,
    step: "01",
    title: "Smart CSV Upload",
    description: "Upload bank statements from any bank. Our AI automatically detects and categorizes your transactions.",
    features: ["Bank-grade encryption", "Read-only access", "Auto-sync transactions"]
  },
  {
    icon: BarChart3,
    step: "02", 
    title: "Interactive Analytics",
    description: "Beautiful charts and insights help you understand your spending patterns and identify opportunities to save.",
    features: ["Smart categorization", "Pattern recognition", "Continuous learning"]
  },
  {
    icon: Target,
    step: "03",
    title: "Budget Tracking",
    description: "Set budgets for different categories and get real-time alerts when you're approaching your limits.",
    features: ["Visual dashboards", "Trend analysis", "Custom insights"]
  },
  {
    icon: Brain,
    step: "04",
    title: "AI-Powered Insights",
    description: "Get personalized recommendations and actionable advice to optimize your financial health and grow your savings.",
    features: ["Budget tracking", "Goal setting", "Real-time alerts"]
  }
];

export const HowItWorksSection = memo(() => {
  return (
    <section id="how-it-works" className="min-h-screen flex items-center justify-center px-6 py-20">
      <div className="container mx-auto max-w-6xl">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl font-bold mb-4">How Spendly Works</h2>
          <p className="text-xl text-gray-400">Transform your financial life in 4 simple steps</p>
        </motion.div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {steps.slice(0, 3).map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="relative"
            >
              {/* Step number indicator */}
              <div className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-r from-coral to-teal rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg z-10">
                {step.step}
              </div>
              
              {/* Process flow arrow (except for last card) */}
              {index < 2 && (
                <div className="hidden md:block absolute -right-4 top-1/2 transform -translate-y-1/2 z-0">
                  <div className="w-8 h-0.5 bg-gradient-to-r from-teal to-coral"></div>
                  <div className="w-0 h-0 border-l-[8px] border-l-coral border-t-[4px] border-t-transparent border-b-[4px] border-b-transparent absolute right-0 top-1/2 transform -translate-y-1/2"></div>
                </div>
              )}
              
              {/* Card with step-focused design */}
              <div className="bg-white/5 border-2 border-dashed border-gray-600/50 rounded-2xl p-8 h-full group hover:border-teal hover:bg-white/10 transition-all duration-300">
                {/* Large icon with pulsing effect */}
                <motion.div 
                  className="w-20 h-20 bg-gradient-to-br from-teal/10 to-coral/10 rounded-full flex items-center justify-center mb-6 mx-auto"
                  animate={{ 
                    scale: [1, 1.05, 1],
                    boxShadow: [
                      "0 0 0 0 rgba(94, 234, 212, 0)",
                      "0 0 0 10px rgba(94, 234, 212, 0.1)",
                      "0 0 0 0 rgba(94, 234, 212, 0)"
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity, delay: index * 0.3 }}
                >
                  <step.icon className="w-10 h-10 text-teal" />
                </motion.div>
                
                {/* Content with step formatting */}
                <div className="space-y-4 text-center">
                  <h3 className="text-xl font-bold text-white">{step.title}</h3>
                  <p className="text-gray-300 leading-relaxed text-sm">{step.description}</p>
                  
                  {/* Mini progress indicator */}
                  <div className="flex justify-center space-x-1 mt-4">
                    {[1, 2, 3, 4].map((dot) => (
                      <div 
                        key={dot}
                        className={`w-2 h-2 rounded-full transition-all duration-300 ${
                          dot <= index + 1 ? 'bg-teal' : 'bg-gray-600'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Final step - timeline completion */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-12 relative"
        >
          {/* Completion badge */}
          <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-16 h-16 bg-gradient-to-r from-coral to-teal rounded-full flex items-center justify-center text-white font-bold text-xl shadow-2xl z-10">
            ✓
          </div>
          
          {/* Final result card */}
          <div className="bg-gradient-to-r from-coral/10 via-teal/5 to-mint/10 border-2 border-solid border-gradient-to-r from-coral to-teal rounded-3xl p-8 md:p-12 text-center">
            <div className="flex flex-col md:flex-row items-center justify-center space-y-6 md:space-y-0 md:space-x-8">
              {/* Icon with special effect */}
              <motion.div 
                className="w-20 h-20 bg-gradient-to-r from-coral to-teal rounded-full flex items-center justify-center flex-shrink-0"
                animate={{ 
                  rotate: [0, 360],
                  scale: [1, 1.1, 1]
                }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                {(() => {
                  const IconComponent = steps[3].icon;
                  return <IconComponent className="w-10 h-10 text-white" />;
                })()}
              </motion.div>
              
              {/* Content */}
              <div className="flex-1 space-y-4">
                <h3 className="text-3xl font-bold bg-gradient-to-r from-coral to-teal bg-clip-text text-transparent">{steps[3].title}</h3>
                <p className="text-gray-300 leading-relaxed text-lg">{steps[3].description}</p>
              </div>
            </div>
          </div>
        </motion.div>
        
        {/* Vibrant CTA with StarBorder button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <p className="text-gray-400 mb-6 text-lg">
            Ready to transform your financial life?
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <StarBorder 
              color="cyan"
              speed="4s"
              thickness={0.5}
              className="inline-block"
            >
              Get Started Free
            </StarBorder>
            <MagneticButton 
              variant="secondary"
              className="px-6 py-3 rounded-full"
            >
              View Demo ▶
            </MagneticButton>
          </div>
        </motion.div>
      </div>
    </section>
  );
});

HowItWorksSection.displayName = "HowItWorksSection";