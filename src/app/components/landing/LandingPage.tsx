'use client';

import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, Shield, Zap, Lock, FileCheck, TrendingUp, ChevronRight, Menu, X } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { HeroAnimation } from './HeroAnimation';
import { useApp } from '@/context/AppContext';

const navItems = [
  { name: 'Features', href: '#' },
  { name: 'Pricing', href: '#' },
  { name: 'Demo', onClick: () => {} },
  { name: 'Contact', href: '#' },
];

export function LandingPage() {
  const { setCurrentPage } = useApp();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted">
      {/* Header */}
      <header className="relative z-50 px-4 py-6 backdrop-blur-sm bg-card/90 border-b border-border/50">
        <div className="container mx-auto flex items-center justify-between">
          {/* Logo */}
          <motion.div 
            className="flex items-center gap-3"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <div className="w-10 h-10 bg-gradient-to-r from-primary via-accent to-success rounded-xl flex items-center justify-center shadow-lg">
              <Sparkles className="w-5 h-5 text-background" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary via-accent to-success bg-clip-text text-transparent">
                ApplySmart
              </h1>
              <p className="text-xs text-muted-foreground font-medium">AI Exam Prep</p>
            </div>
          </motion.div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item, i) => (
              <motion.button
                key={item.name}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.05 }}
                className="text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent/10 px-3 py-2 rounded-lg transition-all duration-200 flex items-center gap-1 group"
                onClick={item.onClick}
              >
                {item.name}
                <ChevronRight className="w-3 h-3 opacity-50 group-hover:translate-x-1 transition-transform" />
              </motion.button>
            ))}
            <Button
              size="sm"
              variant="accent"
              onClick={() => setCurrentPage('auth')}
              className="ml-4 font-semibold"
            >
              Get Started
            </Button>
          </nav>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </Button>
        </div>

        {/* Mobile Menu */}
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: isMenuOpen ? 1 : 0, height: isMenuOpen ? 'auto' : 0 }}
          exit={{ opacity: 0, height: 0 }}
          className="md:hidden mt-4 overflow-hidden"
        >
          <div className="bg-card border border-border rounded-2xl p-6 space-y-4 shadow-xl">
            {navItems.map((item) => (
              <Button
                key={item.name}
                variant="ghost"
                className="w-full justify-start h-12 text-left hover:bg-accent/20 border-none"
                onClick={() => {
                  item.onClick?.();
                  setIsMenuOpen(false);
                }}
              >
                <span className="flex items-center justify-between w-full">
                  {item.name}
                  <ChevronRight className="w-4 h-4 opacity-50" />
                </span>
              </Button>
            ))}
            <Button
              size="sm"
              variant="accent"
              className="w-full"
              onClick={() => {
                setCurrentPage('auth');
                setIsMenuOpen(false);
              }}
            >
              Get Started
            </Button>
          </div>
        </motion.div>
      </header>

      {/* Hero Section - EXACTLY AS ORIGINAL */}
      <section className="relative overflow-hidden pt-0">
        <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-success/5" />
        
        <div className="container mx-auto px-4 py-12 md:py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 bg-accent/10 text-accent px-4 py-2 rounded-full mb-6 border border-accent/20">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-medium">India's #1 Exam Application AI Platform</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-primary via-accent to-success bg-clip-text text-transparent leading-tight">
              AI that prepares your<br />exam documents —<br />correctly, every time.
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              No cyber cafés. No rejections. No guesswork.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-4">
              <Button
                size="xl"
                variant="accent"
                onClick={() => setCurrentPage('auth')}
                className="group"
              >
                Get Started
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                size="xl"
                variant="outline"
                onClick={() => setCurrentPage('demo')}
              >
                View Demo
              </Button>
            </div>
            
            <p className="text-sm text-muted-foreground">
              <Lock className="w-4 h-4 inline mr-1" />
              Encrypted · Auto-delete · Privacy-first
            </p>
          </motion.div>

          {/* Hero Animation - EXACTLY AS ORIGINAL */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <HeroAnimation />
          </motion.div>
        </div>
      </section>

      {/* Features Section - EXACTLY AS ORIGINAL */}
      <section className="py-20 bg-card">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              Government-grade compliance,<br />startup-level simplicity
            </h2>
            <p className="text-xl text-muted-foreground">
              Built for NDA, JEE, NEET, UPSC, and more
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-background p-8 rounded-2xl border border-border hover:border-accent/50 transition-colors"
              >
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4 text-accent">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works - EXACTLY AS ORIGINAL */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              How ApplySmart works
            </h2>
            <p className="text-xl text-muted-foreground">
              From raw photo to exam-ready in seconds
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto space-y-8">
            {steps.map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="flex gap-6 items-start"
              >
                <div className="flex-shrink-0 w-12 h-12 bg-accent text-primary rounded-full flex items-center justify-center font-mono font-bold">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section - EXACTLY AS ORIGINAL */}
      <section className="py-20 bg-gradient-to-r from-primary via-primary/95 to-accent/80 text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              Ready to eliminate rejections?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Join thousands of students who trust ApplySmart
            </p>
            <Button
              size="xl"
              variant="secondary"
              onClick={() => setCurrentPage('auth')}
              className="group"
            >
              Start Your Application
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Footer - EXACTLY AS ORIGINAL */}
      <footer className="bg-card py-12 border-t border-border">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-bold text-lg mb-4">ApplySmart</h3>
              <p className="text-sm text-muted-foreground">
                AI-powered exam application platform for Indian competitive exams.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Demo</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">DPDP Act Compliance</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Support</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Feedback</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Hackathon Project</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-border pt-8 text-center text-sm text-muted-foreground">
            <p>© 2026 ApplySmart. Built for India's students, with government-grade security.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Features & Steps - EXACTLY AS ORIGINAL
const features = [
  {
    icon: <FileCheck className="w-6 h-6" />,
    title: 'Auto-Correction Engine',
    description: 'AI fixes dimensions, DPI, background, shadows, and file naming automatically to exact exam standards.',
  },
  {
    icon: <Shield className="w-6 h-6" />,
    title: 'Explainable AI',
    description: 'Every check shows what failed, why it failed, which rule, and how it was corrected. No black boxes.',
  },
  {
    icon: <Lock className="w-6 h-6" />,
    title: 'Privacy-First Security',
    description: 'End-to-end encryption, manual deletion only, Aadhaar masking, DPDP Act compliant.',
  },
  {
    icon: <Zap className="w-6 h-6" />,
    title: 'Lightning Fast',
    description: 'Upload, validate, and correct documents in seconds. Save hours compared to traditional methods.',
  },
  {
    icon: <TrendingUp className="w-6 h-6" />,
    title: 'Compliance Tracking',
    description: 'Real-time compliance scores, rejection risk analysis, and improvement suggestions.',
  },
  {
    icon: <Sparkles className="w-6 h-6" />,
    title: 'Year-Versioned Rules',
    description: 'Always up-to-date with latest NDA, JEE, NEET, UPSC requirements. Rules parsed from official PDFs.',
  },
];

const steps = [
  {
    title: 'Select Your Exam',
    description: 'Choose from NDA, JEE, NEET, UPSC, and more. Rules are automatically loaded for the selected year.',
  },
  {
    title: 'Upload Documents',
    description: 'Drag & drop or use your camera to upload photos and signatures. Mobile-first design for ease of use.',
  },
  {
    title: 'AI Validates & Corrects',
    description: 'Our AI checks dimensions, DPI, background, shadows, and more. Auto-corrections are applied instantly.',
  },
  {
    title: 'Download & Submit',
    description: 'Get exam-compliant documents with proper naming. Save to vault for future applications.',
  },
];
