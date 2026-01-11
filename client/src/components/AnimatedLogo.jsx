import React from 'react';
import { motion } from 'framer-motion';
import './AnimatedLogo.css';

const AnimatedLogo = ({ onClick }) => {
  const pathVariants = {
    hidden: { 
      pathLength: 0, 
      opacity: 0 
    },
    visible: (custom) => ({
      pathLength: 1,
      opacity: 1,
      transition: {
        pathLength: { 
          delay: custom * 0.2, 
          duration: 1.5, 
          ease: "easeInOut" 
        },
        opacity: { 
          delay: custom * 0.2, 
          duration: 0.5 
        }
      }
    })
  };

  const textVariants = {
    hidden: { 
      opacity: 0, 
      x: -20 
    },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        delay: 0.8,
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const containerVariants = {
    hover: {
      scale: 1.05,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    }
  };

  return (
    <motion.div 
      className="animated-logo-container"
      onClick={onClick}
      variants={containerVariants}
      whileHover="hover"
      whileTap={{ scale: 0.95 }}
    >
      <svg 
        width="40" 
        height="40" 
        viewBox="0 0 200 200" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <motion.path 
          d="M50 150 C 50 50, 150 50, 150 150" 
          stroke="url(#paint0_linear_animated)" 
          strokeWidth="20" 
          strokeLinecap="round"
          variants={pathVariants}
          initial="hidden"
          animate="visible"
          custom={0}
        />
        <motion.path 
          d="M75 125 C 75 75, 125 75, 125 125" 
          stroke="url(#paint1_linear_animated)" 
          strokeWidth="20" 
          strokeLinecap="round"
          variants={pathVariants}
          initial="hidden"
          animate="visible"
          custom={1}
        />
        <motion.path 
          d="M100 100 C 100 87.5, 112.5 87.5, 112.5 100" 
          stroke="url(#paint2_linear_animated)" 
          strokeWidth="20" 
          strokeLinecap="round"
          variants={pathVariants}
          initial="hidden"
          animate="visible"
          custom={2}
        />
        <defs>
          <linearGradient id="paint0_linear_animated" x1="50" y1="100" x2="150" y2="100" gradientUnits="userSpaceOnUse">
            <stop stopColor="#8A2BE2"/>
            <stop offset="1" stopColor="#4B0082"/>
          </linearGradient>
          <linearGradient id="paint1_linear_animated" x1="75" y1="100" x2="125" y2="100" gradientUnits="userSpaceOnUse">
            <stop stopColor="#8A2BE2"/>
            <stop offset="1" stopColor="#FF00FF"/>
          </linearGradient>
          <linearGradient id="paint2_linear_animated" x1="100" y1="93.75" x2="112.5" y2="93.75" gradientUnits="userSpaceOnUse">
            <stop stopColor="#8A2BE2"/>
            <stop offset="1" stopColor="#FF00FF"/>
          </linearGradient>
        </defs>
      </svg>
      <motion.span 
        className="animated-logo-text"
        variants={textVariants}
        initial="hidden"
        animate="visible"
      >
        FROLIC
      </motion.span>
    </motion.div>
  );
};

export default AnimatedLogo;