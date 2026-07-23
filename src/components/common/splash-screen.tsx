import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
// Colors sampled directly from the रेvvano brand artwork.
const COFFEE_BROWN = '#1c1004';
const CREAM = '#FFF8EB';

const lotusPaths = [
  'M60 52C65 32.2 65 32.2 60 8C55 27.8 55 27.8 60 52Z',
  'M60 52C55.8 31.6 55.8 31.6 39 13C43.6 33.2 43.6 33.2 60 52Z',
  'M60 52C74.3 37.1 74.3 37.1 81 13C66.3 27.7 66.3 27.7 60 52Z',
  'M60 52C48.8 30.8 48.8 30.8 23 18C35.3 38.1 35.3 38.1 60 52Z',
  'M60 52C81 41.5 81 41.5 97 18C74.9 27.4 74.9 27.4 60 52Z',
  'M60 52C41.5 34.3 41.5 34.3 11 31C30.3 46.9 30.3 46.9 60 52Z',
  'M60 52C84.8 49 84.8 49 109 31C83.4 32.2 83.4 32.2 60 52Z',
];

export function SplashScreen() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-auto"
          style={{ backgroundColor: COFFEE_BROWN }}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, pointerEvents: 'none' }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
        >
          {/* Decorative rings */}
          <motion.div
            className="absolute h-32 w-32 rounded-full border"
            style={{ borderColor: 'rgba(255, 248, 235, 0.15)' }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: [0, 1.2, 1], opacity: [0, 0.6, 0.3] }}
            transition={{ duration: 1.4, ease: 'easeOut' }}
          />
          <motion.div
            className="absolute h-48 w-48 rounded-full border"
            style={{ borderColor: 'rgba(255, 248, 235, 0.1)' }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: [0, 1.3, 1], opacity: [0, 0.4, 0.15] }}
            transition={{ duration: 1.6, ease: 'easeOut', delay: 0.1 }}
          />

          {/* Brand mark */}
          <div className="relative flex flex-col items-center">
            <div className="flex items-end" style={{ color: CREAM }}>
              {/* रे glyph */}
              <motion.span
                className="font-heading font-semibold leading-[0.75]"
                style={{ fontSize: '5.2rem' }}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              >
                रे
              </motion.span>

              <div className="flex flex-col items-center pb-2">
                {/* Lotus — draws itself in stroke by stroke */}
                <svg
                  viewBox="0 0 120 56"
                  className="w-16 sm:w-20 h-auto -mb-1"
                  fill="none"
                  stroke={CREAM}
                  strokeWidth="1.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  {lotusPaths.map((d, i) => (
                    <motion.path
                      key={i}
                      d={d}
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{ pathLength: 1, opacity: 1 }}
                      transition={{ delay: 0.5 + i * 0.08, duration: 0.5, ease: 'easeOut' }}
                    />
                  ))}
                </svg>

                {/* Underline reveal */}
                <motion.div
                  className="h-px mb-1"
                  style={{ backgroundColor: CREAM }}
                  initial={{ width: 0 }}
                  animate={{ width: '4.2rem' }}
                  transition={{ delay: 1.15, duration: 0.5, ease: 'easeOut' }}
                />

                {/* vvano wordmark */}
                <motion.span
                  className="font-heading font-semibold text-4xl sm:text-5xl tracking-tight"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.3, duration: 0.5, ease: 'easeOut' }}
                >
                  vvano
                </motion.span>
              </div>
            </div>

            {/* Tagline */}
            <motion.p
              className="text-xs uppercase tracking-[0.3em] mt-5"
              style={{ color: 'rgba(255, 248, 235, 0.55)' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.7, duration: 0.5 }}
            >
              Wear Your Mood
            </motion.p>
          </div>

          {/* Loading bar */}
          <motion.div
            className="absolute bottom-20 h-px overflow-hidden"
            style={{ width: '200px', backgroundColor: 'rgba(255, 248, 235, 0.25)' }}
          >
            <motion.div
              className="h-full"
              style={{ backgroundColor: CREAM }}
              initial={{ x: '-100%' }}
              animate={{ x: '100%' }}
              transition={{ delay: 1.9, duration: 1, ease: 'easeInOut' }}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}