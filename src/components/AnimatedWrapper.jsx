/**
 * 🎭 COMPONENTE: AnimatedWrapper
 * 
 * Wrapper que aplica animações respeitando prefers-reduced-motion
 * Uso: substitui <motion.div> por <AnimatedWrapper>
 */

import React from 'react';
import { motion } from 'framer-motion';
import { useReducedMotion, getTransition } from '../hooks/useReducedMotion';

export const AnimatedWrapper = ({ 
  children, 
  variants, 
  initial, 
  animate, 
  exit,
  transition,
  ...props 
}) => {
  const prefersReducedMotion = useReducedMotion();

  // Se o usuário prefere movimento reduzido, renderiza sem animações
  if (prefersReducedMotion) {
    return <div {...props}>{children}</div>;
  }

  // Caso contrário, renderiza com animações
  return (
    <motion.div
      variants={variants}
      initial={initial}
      animate={animate}
      exit={exit}
      transition={getTransition(false, transition)}
      {...props}
    >
      {children}
    </motion.div>
  );
};

/**
 * 🔘 COMPONENTE: AnimatedButton
 * 
 * Botão animado que respeita prefers-reduced-motion
 */
export const AnimatedButton = ({ 
  children, 
  variants, 
  whileHover,
  whileTap,
  ...props 
}) => {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return <button {...props}>{children}</button>;
  }

  return (
    <motion.button
      variants={variants}
      initial="rest"
      whileHover={whileHover || "hover"}
      whileTap={whileTap || "tap"}
      {...props}
    >
      {children}
    </motion.button>
  );
};

export default AnimatedWrapper;
