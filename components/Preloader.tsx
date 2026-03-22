'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState, useSyncExternalStore } from 'react';

const greetings = [
  'Hello',
  'Bonjour',
  'Hola',
  'Ciao',
  'Hallo',
  'Konnichiwa',
  'Namaste',
];

const subscribe = (callback: () => void) => {
  window.addEventListener('resize', callback);
  return () => window.removeEventListener('resize', callback);
};

const getSnapshot = () =>
  JSON.stringify({ width: window.innerWidth, height: window.innerHeight });

const getServerSnapshot = () => JSON.stringify({ width: 0, height: 0 });

export default function Preloader() {
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const dimension = JSON.parse(
    useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot),
  ) as { width: number; height: number };

  useEffect(() => {
    if (index === greetings.length - 1) {
      setTimeout(() => {
        setLoading(false);
      }, 1000);
      return;
    }

    setTimeout(
      () => {
        setIndex(index + 1);
      },
      index === 0 ? 1000 : 200,
    );
  }, [index]);

  const w = dimension.width;
  const h = dimension.height;

  const initialPath = `M0 0 L${w} 0 L${w} ${h} Q${w / 2} ${h} 0 ${h} L0 0`;
  const curvedPath = `M0 0 L${w} 0 L${w} ${h * 0.2} Q${w / 2} ${h * 0.2 + 250} 0 ${h * 0.2} L0 0`;
  const endPath = `M0 0 L${w} 0 L${w} 0 Q${w / 2} 0 0 0 L0 0`;

  const curve = {
    initial: {
      d: initialPath,
    },
    exit: {
      d: [initialPath, curvedPath, endPath],
      transition: {
        duration: 0.6,
        ease: 'linear' as const,
        delay: 0.3,
      },
    },
  };

  return (
    <AnimatePresence mode="wait">
      {loading && (
        <motion.div
          key="preloader"
          className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
        >
          {dimension.width > 0 && (
            <svg className="absolute top-0 w-full h-[calc(100%+500px)]">
              <motion.path
                variants={curve}
                initial="initial"
                exit="exit"
                fill="#000"
              ></motion.path>
            </svg>
          )}

          <motion.p
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="text-4xl md:text-6xl font-medium tracking-tight text-white z-10"
          >
            <span className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-white"></span>
              {greetings[index]}
            </span>
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
