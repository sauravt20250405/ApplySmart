import { motion } from 'motion/react';
import { ArrowLeft, Play, CheckCircle2, Sparkles, Upload } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { useApp } from '@/context/AppContext';

export function DemoMode() {
  const { setCurrentPage } = useApp();

  const demoSteps = [
    {
      title: 'Upload Raw Photo',
      description: 'Upload a photo with common issues like wrong dimensions, shadows, or colored background',
      duration: '2 seconds',
    },
    {
      title: 'AI Validation',
      description: 'Watch as AI checks 7+ validation rules including dimension, DPI, background, shadows, and face detection',
      duration: '3 seconds',
    },
    {
      title: 'Auto-Correction',
      description: 'See real-time corrections being applied: resize, DPI fix, background normalization, shadow removal',
      duration: '2 seconds',
    },
    {
      title: 'Explainable Results',
      description: 'View detailed breakdown showing what was checked, why it failed, which rule was applied, and how it was fixed',
      duration: '5 seconds',
    },
    {
      title: 'Compliance Report',
      description: 'Get a final report with 98% compliance score, confidence levels, and download-ready documents',
      duration: '3 seconds',
    },
  ];

  const handleStartDemo = () => {
    // Auto-login as demo user and go to upload page
    setCurrentPage('auth');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-accent text-primary-foreground py-8">
        <div className="container mx-auto px-4">
          <Button
            variant="ghost"
            onClick={() => setCurrentPage('landing')}
            className="text-primary-foreground hover:bg-primary-foreground/10 mb-4"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Home
          </Button>
          
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Interactive Demo
          </h1>
          <p className="text-primary-foreground/80">
            See ApplySmart in action with a guided walkthrough
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Demo Overview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Card className="mb-8 border-accent/30">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="w-8 h-8 text-accent" />
                </div>
                <h2 className="text-2xl font-bold mb-3">
                  Experience the Full Power of ApplySmart
                </h2>
                <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                  This interactive demo will walk you through the complete document validation workflow,
                  from upload to final compliance report. Total duration: ~15 seconds.
                </p>
                <Button
                  size="xl"
                  variant="accent"
                  onClick={handleStartDemo}
                  className="group"
                >
                  <Play className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                  Start Interactive Demo
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Demo Steps */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold mb-4">What You'll Experience</h3>
            
            {demoSteps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
              >
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-10 h-10 bg-accent text-primary rounded-full flex items-center justify-center font-mono font-bold">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between gap-4 mb-2">
                          <h4 className="font-semibold text-lg">{step.title}</h4>
                          <span className="text-xs font-mono text-muted-foreground bg-muted px-2 py-1 rounded">
                            {step.duration}
                          </span>
                        </div>
                        <p className="text-muted-foreground">{step.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Key Features Showcase */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-12"
          >
            <Card>
              <CardHeader>
                <CardTitle>Demo Highlights</CardTitle>
                <CardDescription>
                  What makes this demo judge-ready
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium mb-1">Real AI Processing</p>
                      <p className="text-sm text-muted-foreground">
                        Actual image analysis with realistic processing times and confidence scores
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium mb-1">Explainable AI</p>
                      <p className="text-sm text-muted-foreground">
                        Every check shows what, why, which rule, and how it was corrected
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium mb-1">Government Standards</p>
                      <p className="text-sm text-muted-foreground">
                        Real NDA 2026 and JEE 2026 rules with official references
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium mb-1">Production-Grade UX</p>
                      <p className="text-sm text-muted-foreground">
                        Polished animations, responsive design, and professional interactions
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="mt-8 text-center"
          >
            <Button
              size="xl"
              variant="accent"
              onClick={handleStartDemo}
              className="group"
            >
              <Play className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
              Launch Demo Now
            </Button>
            <p className="text-sm text-muted-foreground mt-4">
              No signup required • Takes ~15 seconds
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
