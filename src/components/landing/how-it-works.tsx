'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import GradualBlur from '@/components/ui/gradual-blur';

const steps = [
  {
    number: '01',
    title: 'Create your account',
    description: 'Sign up in seconds with your email or social accounts. No credit card required.',
    image: '/images/illustrations/step-1.svg',
  },
  {
    number: '02',
    title: 'Set your budget',
    description: 'Define spending limits for different categories based on your income and goals.',
    image: '/images/illustrations/step-2.svg',
  },
  {
    number: '03',
    title: 'Track and save',
    description: 'Log expenses, monitor your progress, and watch your savings grow over time.',
    image: '/images/illustrations/step-3.svg',
  },
];

export function HowItWorks() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const scrollLeft = container.scrollLeft;
      const stepWidth = container.scrollWidth / steps.length;
      const newActiveStep = Math.min(
        Math.floor((scrollLeft + container.clientWidth / 2) / stepWidth),
        steps.length - 1
      );
      setActiveStep(newActiveStep);
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToStep = (index: number) => {
    const container = containerRef.current;
    if (!container) return;

    const stepWidth = container.scrollWidth / steps.length;
    container.scrollTo({
      left: stepWidth * index,
      behavior: 'smooth',
    });
  };

  return (
    <section id="how-it-works" className="relative py-20 md:py-32 bg-white dark:bg-surface-950 overflow-hidden">
      <GradualBlur
        target="parent"
        position="top"
        height="5rem"
        strength={1.5}
        divCount={4}
        curve="ease-out"
        opacity={0.7}
      />
      <div className="mx-auto max-w-6xl px-6 mb-12">
        <div className="text-center max-w-2xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-surface-900 dark:text-white tracking-tight font-display"
          >
            How it works
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mt-4 text-lg text-surface-500 dark:text-surface-400"
          >
            Get started in three simple steps
          </motion.p>
        </div>
      </div>

      {/* Step indicators */}
      <div className="mx-auto max-w-6xl px-6 mb-10">
        <div className="flex items-center justify-center gap-2">
          {steps.map((step, index) => (
            <button key={step.number} onClick={() => scrollToStep(index)} className="flex items-center gap-3 group">
              <div
                className={cn(
                  'w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300',
                  activeStep === index
                    ? 'bg-surface-900 dark:bg-white text-white dark:text-surface-900'
                    : 'bg-surface-100 dark:bg-surface-800 text-surface-400 dark:text-surface-500 group-hover:bg-surface-200 dark:group-hover:bg-surface-700'
                )}
              >
                {step.number}
              </div>
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    'w-12 md:w-20 h-px transition-colors duration-300',
                    activeStep > index ? 'bg-surface-900 dark:bg-white' : 'bg-surface-200 dark:bg-surface-700'
                  )}
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Horizontal scroll container */}
      <div
        ref={containerRef}
        className="flex overflow-x-auto snap-x snap-mandatory scrollbar-none"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        <div className="flex-shrink-0 w-[calc((100vw-900px)/2)] hidden lg:block" />
        {steps.map((step, index) => (
          <motion.div
            key={step.number}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="flex-shrink-0 w-[90vw] md:w-[800px] lg:w-[900px] snap-center px-6"
          >
            <div
              className={cn(
                'relative grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center p-8 md:p-12 rounded-2xl transition-all duration-300',
                'bg-surface-50 dark:bg-surface-900 border border-surface-100 dark:border-surface-800',
                activeStep === index ? 'opacity-100' : 'opacity-50'
              )}
            >
              <div className="order-2 md:order-1">
                <div className="text-sm font-medium text-surface-400 dark:text-surface-500 mb-3">
                  Step {step.number}
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-surface-900 dark:text-white mb-4">
                  {step.title}
                </h3>
                <p className="text-surface-600 dark:text-surface-400 leading-relaxed">{step.description}</p>
              </div>
              <div className="order-1 md:order-2 flex items-center justify-center">
                <img src={step.image} alt={step.title} className="w-full max-w-[280px] md:max-w-[320px] h-auto object-contain" />
              </div>
            </div>
          </motion.div>
        ))}
        <div className="flex-shrink-0 w-[calc((100vw-900px)/2)] hidden lg:block" />
      </div>

      {/* Mobile scroll hint */}
      <div className="flex items-center justify-center gap-2 mt-6 text-surface-400 dark:text-surface-500 lg:hidden">
        <span className="text-sm">Swipe to navigate</span>
        <ArrowRight className="w-4 h-4" />
      </div>
    </section>
  );
}
