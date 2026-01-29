import { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { Check, X, Sparkles } from 'lucide-react';

export function HeroAnimation() {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    // Start animation loop
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 3000);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full max-w-2xl mx-auto h-[400px] md:h-[500px] flex items-center justify-center">
      {/* Before Image - Raw Photo */}
      <motion.div
        className="absolute left-0 md:left-10"
        animate={{
          x: isAnimating ? 100 : 0,
          opacity: isAnimating ? 0 : 1,
          scale: isAnimating ? 0.8 : 1,
        }}
        transition={{ duration: 1, ease: "easeInOut" }}
      >
        <div className="relative">
          <div className="w-48 h-56 md:w-56 md:h-64 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 rounded-2xl shadow-2xl overflow-hidden border-4 border-destructive/30">
            {/* Simulated bad photo */}
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-100/40 to-orange-100/40" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-24 h-32 bg-gradient-to-b from-amber-800 to-amber-900 rounded-full" />
            </div>
            {/* Shadow overlay */}
            <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black/30 to-transparent" />
          </div>
          
          {/* Error Badge */}
          <motion.div
            className="absolute -top-3 -right-3 bg-destructive text-destructive-foreground rounded-full p-2 shadow-lg"
            animate={{ scale: isAnimating ? [1, 1.2, 1] : 1 }}
            transition={{ duration: 0.5 }}
          >
            <X className="w-6 h-6" />
          </motion.div>
          
          {/* Error Labels */}
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 space-y-1">
            <div className="bg-destructive/90 text-destructive-foreground text-xs px-3 py-1 rounded-full whitespace-nowrap">
              Shadow detected
            </div>
          </div>
        </div>
      </motion.div>

      {/* AI Processing Animation */}
      <motion.div
        className="absolute left-1/2 -translate-x-1/2 z-10"
        animate={{
          opacity: isAnimating ? 1 : 0,
          scale: isAnimating ? 1 : 0.5,
        }}
        transition={{ duration: 0.5 }}
      >
        <div className="relative">
          <motion.div
            className="w-20 h-20 bg-accent rounded-full flex items-center justify-center shadow-2xl"
            animate={{
              rotate: isAnimating ? 360 : 0,
              scale: isAnimating ? [1, 1.1, 1] : 1,
            }}
            transition={{ duration: 1.5, repeat: isAnimating ? 2 : 0 }}
          >
            <Sparkles className="w-10 h-10 text-primary" />
          </motion.div>
          
          {/* Scanning Lines */}
          <motion.div
            className="absolute inset-0 rounded-full border-4 border-accent"
            animate={{
              scale: isAnimating ? [1, 1.5, 2] : 1,
              opacity: isAnimating ? [1, 0.5, 0] : 0,
            }}
            transition={{ duration: 1, repeat: isAnimating ? Infinity : 0 }}
          />
        </div>
      </motion.div>

      {/* After Image - Fixed Photo */}
      <motion.div
        className="absolute right-0 md:right-10"
        initial={{ x: 100, opacity: 0, scale: 0.8 }}
        animate={{
          x: isAnimating ? 0 : 100,
          opacity: isAnimating ? 1 : 0,
          scale: isAnimating ? 1 : 0.8,
        }}
        transition={{ duration: 1, delay: 1, ease: "easeInOut" }}
      >
        <div className="relative">
          <div className="w-48 h-56 md:w-56 md:h-64 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-2xl overflow-hidden border-4 border-success/30">
            {/* Simulated good photo */}
            <div className="absolute inset-0 bg-white dark:bg-gray-800" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-24 h-32 bg-gradient-to-b from-amber-700 to-amber-800 rounded-full" />
            </div>
          </div>
          
          {/* Success Badge */}
          <motion.div
            className="absolute -top-3 -right-3 bg-success text-success-foreground rounded-full p-2 shadow-lg"
            initial={{ scale: 0 }}
            animate={{ scale: isAnimating ? [0, 1.2, 1] : 0 }}
            transition={{ duration: 0.5, delay: 1.5 }}
          >
            <Check className="w-6 h-6" />
          </motion.div>
          
          {/* Success Labels */}
          <motion.div
            className="absolute -bottom-2 left-1/2 -translate-x-1/2 space-y-1"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: isAnimating ? 1 : 0, y: isAnimating ? 0 : 10 }}
            transition={{ duration: 0.5, delay: 1.8 }}
          >
            <div className="bg-success/90 text-success-foreground text-xs px-3 py-1 rounded-full whitespace-nowrap">
              NDA compliant
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
