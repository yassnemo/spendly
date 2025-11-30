'use client';

import React from 'react';
import { Github, Twitter, Linkedin } from 'lucide-react';

const footerLinks = {
  product: [
    { name: 'Features', href: '#features' },
    { name: 'How it works', href: '#how-it-works' },
    { name: 'Pricing', href: '#' },
    { name: 'FAQ', href: '#' },
  ],
  company: [
    { name: 'About', href: '#' },
    { name: 'Blog', href: '#' },
    { name: 'Careers', href: '#' },
    { name: 'Contact', href: '#' },
  ],
  legal: [
    { name: 'Privacy Policy', href: '#' },
    { name: 'Terms of Service', href: '#' },
    { name: 'Cookie Policy', href: '#' },
  ],
};

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-surface-900 dark:bg-surface-950 border-t border-surface-800">
      <div className="mx-auto max-w-6xl px-6">
        {/* Main footer content */}
        <div className="py-12 md:py-16 grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Brand column */}
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <img src="/images/logo.svg" alt="Spendly" className="w-9 h-9 rounded-xl" />
              <span className="font-semibold text-white text-lg tracking-tight">Spendly</span>
            </div>
            <p className="text-surface-400 text-sm leading-relaxed max-w-xs mb-6">
              Take control of your finances with intelligent tracking, budgeting, and AI-powered insights.
            </p>
            <div className="flex items-center gap-4">
              <a
                href="https://github.com/yassnemo"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-surface-800 hover:bg-surface-700 flex items-center justify-center text-surface-400 hover:text-white transition-colors"
              >
                <Github className="w-4 h-4" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-surface-800 hover:bg-surface-700 flex items-center justify-center text-surface-400 hover:text-white transition-colors"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-surface-800 hover:bg-surface-700 flex items-center justify-center text-surface-400 hover:text-white transition-colors"
              >
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Product links */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-4">Product</h3>
            <ul className="space-y-3">
              {footerLinks.product.map((link) => (
                <li key={link.name}>
                  <a href={link.href} className="text-sm text-surface-400 hover:text-white transition-colors">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company links */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-4">Company</h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <a href={link.href} className="text-sm text-surface-400 hover:text-white transition-colors">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal links */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-4">Legal</h3>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <a href={link.href} className="text-sm text-surface-400 hover:text-white transition-colors">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="py-6 border-t border-surface-800 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-sm text-surface-500">{currentYear} Spendly. All rights reserved.</div>
          <div className="text-sm text-surface-500">
            Built by{' '}
            <a
              href="https://yerradouani.me"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-400 hover:text-primary-300 transition-colors font-medium"
            >
              Yassine Erradouani
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
