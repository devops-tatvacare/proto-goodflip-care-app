'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface WelcomeHandsAnimationProps {
  onAnimationComplete: () => void;
}

export function WelcomeHandsAnimation({ onAnimationComplete }: WelcomeHandsAnimationProps) {
  const [phase, setPhase] = useState<'meeting' | 'merging'>('meeting');

  const handleHandsMeet = () => {
    setPhase('merging');
    // Synchronized timing with background fade-in
    setTimeout(onAnimationComplete, 600);
  };

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-[var(--beige-bg)] z-50">
      <motion.div 
        className="relative w-[1200px] h-[800px]"
        animate={phase === 'merging' ? { y: -150, scale: 0.9, opacity: 0 } : {}}
        transition={{ 
          duration: 0.6, 
          ease: [0.25, 0.46, 0.45, 0.94],
          delay: 0
        }}
      >
        
        {/* Left Hand (Human) - Coming from bottom left */}
        <motion.div
          className="absolute inset-0 overflow-hidden"
          initial={{ x: -400, y: 300, opacity: 0 }}
          animate={{ x: 0, y: 0, opacity: 1 }}
          transition={{ 
            duration: 3, 
            ease: [0.15, 0.05, 0.15, 1],
            type: "spring",
            damping: 25,
            stiffness: 30
          }}
          style={{
            clipPath: 'polygon(0% 0%, 52% 0%, 48% 100%, 0% 100%)',
          }}
        >
          <div className="w-full h-full" style={{ 
            filter: 'hue-rotate(200deg) saturate(1.8) brightness(0.9) contrast(1.1)' 
          }}>
            <img 
              src="/experiments/svg-hands/HumansAI_2_optimized.svg" 
              alt="Left hand - Human"
              className="w-full h-full object-contain"
              style={{ 
                mixBlendMode: 'multiply'
              }}
            />
          </div>
        </motion.div>

        {/* Right Hand (AI/Machine) - Coming from top right */}
        <motion.div
          className="absolute inset-0 overflow-hidden"
          initial={{ x: 400, y: -300, opacity: 0 }}
          animate={{ x: 0, y: 0, opacity: 1 }}
          transition={{ 
            duration: 3, 
            ease: [0.15, 0.05, 0.15, 1],
            type: "spring",
            damping: 25,
            stiffness: 30,
            delay: 1.35
          }}
          onAnimationComplete={() => {
            // Start merge after hands meet
            setTimeout(handleHandsMeet, 600);
          }}
          style={{
            clipPath: 'polygon(48% 0%, 100% 0%, 100% 100%, 52% 100%)',
          }}
        >
          <div className="w-full h-full" style={{ 
            filter: 'saturate(2.2) brightness(1.1) contrast(1.2)' 
          }}>
            <img 
              src="/experiments/svg-hands/HumansAI_2_optimized.svg" 
              alt="Right hand - AI"
              className="w-full h-full object-contain"
              style={{ 
                mixBlendMode: 'multiply'
              }}
            />
          </div>
        </motion.div>

      </motion.div>
    </div>
  );
}