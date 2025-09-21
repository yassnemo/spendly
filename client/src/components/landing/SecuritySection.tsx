import { memo } from "react";
import { motion } from "framer-motion";
import { Shield, Lock, Eye, Database, CheckCircle2 } from "lucide-react";
import { StarBorder } from "@/components/ui/StarBorder";

const securityFeatures = [
  {
    icon: Shield,
    title: "Bank-Grade Security",
    description: "256-bit SSL encryption and multi-factor authentication protect your financial data with military-grade security."
  },
  {
    icon: Lock,
    title: "Data Privacy",
    description: "Your financial information is never sold or shared. We use read-only access to keep your data completely private."
  },
  {
    icon: Eye,
    title: "Transparent Operations",
    description: "Full visibility into how your data is processed. No hidden algorithms or mysterious calculations."
  },
  {
    icon: Database,
    title: "Secure Storage",
    description: "Data encrypted at rest and in transit. Regular security audits and compliance with financial industry standards."
  }
];

const certifications = [
  "SOC 2 Type II Certified",
  "PCI DSS Compliant",
  "GDPR Compliant",
  "ISO 27001 Certified"
];

export const SecuritySection = memo(() => {
  return (
    <section id="security" className="min-h-screen flex items-center justify-center px-6 py-20">
      <div className="container mx-auto max-w-6xl">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl font-bold mb-4">Your Financial Data is Safe & Secure</h2>
          <p className="text-xl text-gray-400">Enterprise-grade security you can trust with your most sensitive information</p>
        </motion.div>
        
        {/* Security fortress layout */}
        <div className="relative">
          {/* Central shield */}
          <div className="text-center mb-12">
            <motion.div 
              className="w-32 h-32 mx-auto relative"
              animate={{ 
                boxShadow: [
                  "0 0 20px rgba(134, 239, 172, 0.3)",
                  "0 0 40px rgba(134, 239, 172, 0.6)",
                  "0 0 20px rgba(134, 239, 172, 0.3)"
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <div className="w-full h-full bg-gradient-to-br from-mint/20 to-teal/20 rounded-full border-4 border-mint/50 flex items-center justify-center">
                <Shield className="w-16 h-16 text-mint" />
              </div>
              {/* Rotating security rings */}
              <motion.div 
                className="absolute inset-0 border-2 border-dashed border-mint/30 rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              />
              <motion.div 
                className="absolute inset-2 border border-dotted border-teal/40 rounded-full"
                animate={{ rotate: -360 }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
              />
            </motion.div>
          </div>
          
          {/* Security features in defensive positions */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {securityFeatures.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                className={`${index % 2 === 0 ? 'md:pr-8' : 'md:pl-8'}`}
              >
                <div className="relative">
                  {/* Security badge */}
                  <div className="absolute -top-3 -right-3 w-8 h-8 bg-gradient-to-r from-mint to-teal rounded-full flex items-center justify-center text-xs font-bold text-white z-10">
                    🛡️
                  </div>
                  
                  {/* Vault-like card */}
                  <div className="bg-gradient-to-br from-slate-800 to-slate-900 border-l-4 border-mint rounded-r-2xl rounded-l-lg p-6 relative overflow-hidden group">
                    {/* Security pattern overlay */}
                    <div className="absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity duration-300">
                      <div className="w-full h-full" style={{
                        backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(134, 239, 172, 0.1) 10px, rgba(134, 239, 172, 0.1) 20px)'
                      }}></div>
                    </div>
                    
                    <div className="relative z-10 flex items-start space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-mint/20 to-teal/20 border border-mint/40 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:border-mint/60 transition-all duration-300">
                        <feature.icon className="w-6 h-6 text-mint" />
                      </div>
                      <div className="space-y-3">
                        <h3 className="text-lg font-semibold text-white flex items-center">
                          {feature.title}
                          <span className="ml-2 text-xs text-mint">✓</span>
                        </h3>
                        <p className="text-gray-300 text-sm leading-relaxed">{feature.description}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Certification vault */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="relative bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 rounded-3xl p-8 border-2 border-mint/20">
            {/* Vault door effect */}
            <div className="absolute inset-4 border border-dashed border-mint/30 rounded-2xl"></div>
            <div className="absolute top-8 left-8 w-6 h-6 bg-mint/40 rounded-full"></div>
            <div className="absolute top-8 right-8 w-6 h-6 bg-mint/40 rounded-full"></div>
            <div className="absolute bottom-8 left-8 w-6 h-6 bg-mint/40 rounded-full"></div>
            <div className="absolute bottom-8 right-8 w-6 h-6 bg-mint/40 rounded-full"></div>
            
            <div className="relative z-10">
              <h3 className="text-xl font-bold mb-6 text-mint flex items-center justify-center">
                <Lock className="w-6 h-6 mr-2" />
                Certified & Compliant Vault
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {certifications.map((cert, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: index * 0.15 }}
                    viewport={{ once: true }}
                    className="relative group"
                  >
                    {/* Certificate seal */}
                    <div className="bg-gradient-to-br from-mint/10 to-teal/10 border-2 border-mint/30 rounded-xl p-4 text-center hover:border-mint/50 transition-all duration-300 group-hover:scale-105">
                      <div className="w-8 h-8 bg-gradient-to-r from-mint to-teal rounded-full flex items-center justify-center mx-auto mb-2">
                        <CheckCircle2 className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-xs text-gray-300 font-medium group-hover:text-mint transition-colors duration-300">{cert}</span>
                    </div>
                    
                    {/* Verification badge */}
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-mint rounded-full flex items-center justify-center text-xs">
                      ✓
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Trust CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <p className="text-gray-400 mb-6 text-lg flex items-center justify-center">
            <Shield className="w-5 h-5 mr-2 text-mint" />
            Your financial data is fortress-protected
          </p>
          <StarBorder 
            color="mint"
            speed="3s"
            thickness={0.8}
            className="inline-block"
          >
            🔒 Enter Secure Vault
          </StarBorder>
        </motion.div>
      </div>
    </section>
  );
});

SecuritySection.displayName = "SecuritySection";