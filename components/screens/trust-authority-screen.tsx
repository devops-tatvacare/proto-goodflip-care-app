"use client"

import { Button } from "@/components/ui/button"
import { Icon } from '@/components/ui/icon'
import { motion } from 'framer-motion'

interface TrustAuthorityScreenProps {
  onNext: () => void
}

export function TrustAuthorityScreen({ onNext }: TrustAuthorityScreenProps) {
  const trustPoints = [
    "Clinically-guided for diabetes & obesity",
    "Personalized for your medication journey", 
    "Works with your CGM, BCA, and labs"
  ]

  return (
    <div className="flex flex-col h-full overflow-y-auto relative" style={{ backgroundColor: "var(--bg-primary)" }}>
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'var(--app-login-gradient)' }}
      />

      <div 
        className="absolute top-0 left-0 right-0 h-72 pointer-events-none"
        style={{
          backgroundImage: 'url(/humansai.png)',
          backgroundSize: 'contain',
          backgroundPosition: 'center top',
          backgroundRepeat: 'no-repeat',
          opacity: 0.15
        }}
      />

      <motion.div 
        className="relative flex flex-col h-full p-6"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <div className="flex-1 flex flex-col justify-center py-4">
          <motion.div 
            className="text-center mb-6"
            initial={{ y: -40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            <motion.div 
              className="mb-4"
              initial={{ scale: 0.8, opacity: 0, y: -20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.05 }}
            >
              <div 
                className="w-16 h-16 rounded-2xl mx-auto flex items-center justify-center"
                style={{ backgroundColor: 'var(--app-primary)' }}
              >
                <Icon name="shield" className="w-8 h-8 text-[var(--ds-text-inverse)]" />
              </div>
            </motion.div>
            
            <motion.h1 
              className="text-xl font-bold mb-3" 
              style={{ color: "var(--text-primary)" }}
              initial={{ y: -25, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              Backed by Medical Excellence
            </motion.h1>
            
            <motion.p 
              className="text-sm mb-4" 
              style={{ color: "var(--text-secondary)" }}
              initial={{ y: -25, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.3 }}
            >
              Our platform combines AI with proven medical expertise
            </motion.p>
          </motion.div>

          <motion.div 
            className="space-y-2 mb-6"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.9, delay: 0.4 }}
          >
            {trustPoints.map((point, index) => (
              <motion.div
                key={index}
                className="flex items-center space-x-3 p-3 rounded-xl bg-[var(--ds-surface-primary)]/60 border border-white/50"
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
              >
                <div 
                  className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: 'var(--status-success)' }}
                >
                  <Icon name="checkCircle" className="w-3 h-3 text-[var(--ds-text-inverse)]" />
                </div>
                <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                  {point}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>

        <motion.div 
          className="pb-4"
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <div 
            className="p-4 rounded-xl text-center mb-4 shadow-md"
            style={{ 
              background: 'linear-gradient(135deg, rgba(39, 116, 174, 0.1) 0%, rgba(39, 116, 174, 0.05) 100%)',
              border: '1px solid rgba(39, 116, 174, 0.2)'
            }}
          >
            <p className="text-base font-bold mb-2" style={{ color: "var(--app-primary)" }}>
              Dr. Sarah Chen, MD
            </p>
            <p className="text-xs font-medium mb-2" style={{ color: "var(--text-secondary)" }}>
              Endocrinologist
            </p>
            <p className="text-sm italic" style={{ color: "var(--text-primary)" }}>
              "Evidence-based care I trust for my patients"
            </p>
          </div>
          <Button
            onClick={onNext}
            className="w-full h-12 text-base font-semibold rounded-xl"
            style={{
              backgroundColor: 'var(--app-primary)',
              color: 'var(--ds-text-inverse)',
              border: 'none'
            }}
          >
            Continue
          </Button>
        </motion.div>
      </motion.div>
    </div>
  )
}