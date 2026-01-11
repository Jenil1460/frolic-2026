import React from 'react';
import { motion } from 'framer-motion';

const ScaleIn = ({ children, delay = 0, duration = 0.5, className = '' }) => {
  return (
    <motion.div
      className={className}
      initial={{
        opacity: 0,
        scale: 0.8
      }}
      whileInView={{
        opacity: 1,
        scale: 1
      }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{
        duration,
        delay,
        ease: [0.34, 1.56, 0.64, 1]
      }}
    >
      {children}
    </motion.div>
  );
};

export default ScaleIn;