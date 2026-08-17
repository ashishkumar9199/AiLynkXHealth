import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../context/AppContext';
import { Activity, ShieldCheck, Heart, RefreshCw } from 'lucide-react';

const LOADING_HINTS = [
  'Establishing secure connection...',
  'Synchronizing electronic health records...',
  'Contacting medical gateway API...',
  'Verifying diagnostic node integrity...',
  'Loading clinical dashboards...',
  'Encrypting end-to-end data...'
];

export const GlobalLoadingOverlay: React.FC = () => {
  const { isGlobalLoading } = useApp();
  const [hintIndex, setHintIndex] = useState(0);

  // Rotate hint phrases while loading is active
  useEffect(() => {
    if (!isGlobalLoading) return;
    
    const interval = setInterval(() => {
      setHintIndex((prev) => (prev + 1) % LOADING_HINTS.length);
    }, 1800);

    return () => clearInterval(interval);
  }, [isGlobalLoading]);

  return (
    <AnimatePresence>
      {isGlobalLoading && (
        <motion.div
          id="global-loading-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35, ease: 'easeInOut' }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-slate-950/80 backdrop-blur-md"
        >
          {/* Main Visual Spinner Container */}
          <div className="relative flex flex-col items-center p-8 max-w-sm text-center">
            
            {/* Double-Ring Concentric Custom Spinner */}
            <div className="relative w-24 h-24 flex items-center justify-center mb-6">
              
              {/* Outer Outer Glow */}
              <div className="absolute inset-0 rounded-full bg-blue-500/10 blur-xl animate-pulse"></div>
              
              {/* Outer Slow Ring */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 4, ease: 'linear' }}
                className="absolute inset-0 rounded-full border-4 border-dashed border-blue-500/30"
              />

              {/* Inner Fast Ring */}
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
                className="absolute inset-1.5 rounded-full border-4 border-t-red-500 border-r-transparent border-b-blue-600 border-l-transparent"
              />

              {/* Center Oscillating Heartbeat Icon */}
              <motion.div
                animate={{ scale: [0.9, 1.15, 0.9] }}
                transition={{ repeat: Infinity, duration: 1.2, ease: 'easeInOut' }}
                className="absolute flex items-center justify-center w-12 h-12 rounded-full bg-slate-900 border border-slate-800 shadow-lg text-red-500"
              >
                <Activity className="w-6 h-6 animate-pulse" />
              </motion.div>
            </div>

            {/* Title / Primary Message */}
            <motion.h3 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="text-white text-base font-black tracking-tight flex items-center gap-2 mb-2"
            >
              <RefreshCw className="w-4 h-4 animate-spin text-blue-400" />
              Medicare Plus
            </motion.h3>

            {/* Dynamic Loading Status Hint */}
            <div className="h-6 overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.p
                  key={hintIndex}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.25 }}
                  className="text-xs text-slate-400 font-medium tracking-wide"
                >
                  {LOADING_HINTS[hintIndex]}
                </motion.p>
              </AnimatePresence>
            </div>

            {/* Compliance Footer Security indicator inside overlay */}
            <div className="mt-8 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/60 border border-slate-800 text-[10px] text-slate-500 font-semibold uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              Secure HIPAA Gateway
            </div>

          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
