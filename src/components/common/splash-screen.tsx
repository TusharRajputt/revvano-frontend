import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

// Exact colors as specified from the brand artwork.
const INK = '#32220D';
const CREAM = '#F6F0DF';

export function SplashScreen() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), 2400);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-auto"
          style={{ backgroundColor: CREAM }}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, pointerEvents: 'none' }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
        >
          {/* Decorative rings */}
          <motion.div
            className="absolute h-40 w-40 rounded-full border"
            style={{ borderColor: 'rgba(50, 34, 13, 0.12)' }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: [0, 1.2, 1], opacity: [0, 0.6, 0.3] }}
            transition={{ duration: 1.4, ease: 'easeOut' }}
          />
          <motion.div
            className="absolute h-60 w-60 rounded-full border"
            style={{ borderColor: 'rgba(50, 34, 13, 0.08)' }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: [0, 1.3, 1], opacity: [0, 0.4, 0.15] }}
            transition={{ duration: 1.6, ease: 'easeOut', delay: 0.1 }}
          />

          <div className="relative flex flex-col items-center">
            <motion.img
              src="/brand/revvano-lotus-logo.png"
              alt="रेvvano"
              className="w-64 sm:w-80 h-auto"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            />

            <motion.p
              className="text-xs uppercase tracking-[0.3em] mt-5"
              style={{ color: INK, opacity: 0.55 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.55 }}
              transition={{ delay: 0.9, duration: 0.5 }}
            >
              Wear Your Mood
            </motion.p>
          </div>

          {/* Loading bar */}
          <motion.div
            className="absolute bottom-20 h-px overflow-hidden"
            style={{ width: '200px', backgroundColor: 'rgba(50, 34, 13, 0.2)' }}
          >
            <motion.div
              className="h-full"
              style={{ backgroundColor: INK }}
              initial={{ x: '-100%' }}
              animate={{ x: '100%' }}
              transition={{ delay: 1.1, duration: 1, ease: 'easeInOut' }}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
