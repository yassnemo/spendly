'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Image from 'next/image';

const steps = [
  {
    number: '1',
    title: 'Create Account',
    description: 'Sign up in seconds with your email or social accounts. No credit card required.',
  },
  {
    number: '2',
    title: 'Set Budget',
    description: 'Define spending limits for different categories based on your income and goals.',
  },
  {
    number: '3',
    title: 'Track & Save',
    description: 'Log expenses, monitor your progress, and watch your savings grow over time.',
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="relative py-20 md:py-32 bg-surface-900 dark:bg-surface-950 overflow-hidden">
      <div className="mx-auto max-w-6xl px-6">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 md:mb-24">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-white tracking-tight font-display"
          >
            How it works
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mt-4 text-lg text-surface-400"
          >
            Get started in three simple steps
          </motion.p>
        </div>

        {/* Desktop Layout - All in one row */}
        <div className="hidden lg:flex items-start justify-center gap-8">
          {steps.map((step, index) => (
            <React.Fragment key={step.number}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                className="flex flex-col items-center text-center w-[240px]"
              >
                {/* Circle Wave with Number */}
                <div className="relative mb-8 w-28 h-28">
                  <Image 
                    src="/circleWave.svg" 
                    alt="" 
                    fill 
                    className="object-contain opacity-50" 
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center">
                      <span className="text-2xl font-bold text-surface-900">{step.number}</span>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <h3 className="text-xl font-semibold text-white mb-3">
                  {step.title}
                </h3>
                <p className="text-surface-400 text-sm leading-relaxed mb-4">
                  {step.description}
                </p>
                
                {/* See More Link */}
                <button className="inline-flex items-center gap-1 text-primary-400 hover:text-primary-300 text-sm font-medium transition-colors group">
                  See More
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </motion.div>

              {/* Arrow between steps */}
              {index < steps.length - 1 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.15 + 0.1 }}
                  className="flex-shrink-0 mt-12"
                >
                  <Image 
                    src="/arrowNext.svg" 
                    alt="" 
                    width={100} 
                    height={35} 
                    className="opacity-70"
                  />
                </motion.div>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Mobile/Tablet Layout - Horizontal scroll */}
        <div className="lg:hidden -mx-6 px-6">
          <div className="flex gap-6 overflow-x-auto pb-6 snap-x snap-mandatory scrollbar-hide">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex-shrink-0 w-[280px] snap-center flex flex-col items-center text-center"
              >
                {/* Circle Wave with Number */}
                <div className="relative mb-6 w-24 h-24">
                  <Image 
                    src="/circleWave.svg" 
                    alt="" 
                    fill 
                    className="object-contain opacity-50" 
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center">
                      <span className="text-xl font-bold text-surface-900">{step.number}</span>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <h3 className="text-lg font-semibold text-white mb-2">
                  {step.title}
                </h3>
                <p className="text-surface-400 text-sm leading-relaxed mb-4">
                  {step.description}
                </p>
                
                {/* See More Link */}
                <button className="inline-flex items-center gap-1 text-primary-400 hover:text-primary-300 text-sm font-medium transition-colors group">
                  See More
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </motion.div>
            ))}
          </div>

          {/* Scroll indicator dots */}
          <div className="flex justify-center gap-2 mt-2">
            {steps.map((_, i) => (
              <div key={i} className="w-2 h-2 rounded-full bg-surface-600" />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
