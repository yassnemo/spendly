'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-surface-950 flex items-center justify-center px-6 py-12">
      <div className="max-w-7xl mx-auto w-full flex flex-col lg:flex-row items-center justify-center gap-4 lg:gap-6">
        {/* Left side - Text content */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="lg:text-left order-2 lg:order-1"
        >
          {/* 404 */}
          <h1 className="text-[80px] md:text-[100px] lg:text-[120px] font-black text-white leading-none tracking-tight">
            404
          </h1>

          {/* ERROR: REDACTED */}
          <h2 className="text-lg md:text-xl font-bold text-white tracking-[0.2em] uppercase mt-4 mb-6">
            ERROR: REDACTED
          </h2>

          {/* Description */}
          <p className="text-surface-400 leading-relaxed text-base max-w-md mb-8">
            This page could not be found. It either doesn't exist or was deleted. Or perhaps you don't exist and this webpage couldn't find you.
          </p>

          {/* Back to homepage Link */}
          <Link
            href="/"
            className="group inline-flex items-center gap-1 text-base font-medium transition-colors"
            style={{ color: '#DB6251' }}
          >
            <ChevronRight className="w-4 h-4" />
            Back to homepage
          </Link>
        </motion.div>

        {/* Right side - Illustration */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex justify-center order-1 lg:order-2 lg:flex-1"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/not-found.svg"
            alt="Page not found"
            className="w-[300px] md:w-[450px] lg:w-[600px] xl:w-[750px] h-auto 
              opacity-90 brightness-95
              transition-all duration-300"
          />
        </motion.div>
      </div>
    </div>
  );
}
