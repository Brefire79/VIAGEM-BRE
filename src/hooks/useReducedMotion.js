/**
 * 🎛️ HOOK: useReducedMotion
 * 
 * Detecta se o usuário tem preferência por movimento reduzido
 * Respeita configurações de acessibilidade do sistema
 */

import { useState, useEffect } from 'react';

export const useReducedMotion = () => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    // Verifica suporte a matchMedia
    if (typeof window === 'undefined' || !window.matchMedia) {
      return;
    }

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    // Define o estado inicial
    setPrefersReducedMotion(mediaQuery.matches);

    // Listener para mudanças na preferência
    const handleChange = (event) => {
      setPrefersReducedMotion(event.matches);
    };

    // Safari 13 e versões anteriores não suportam addEventListener
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    } else {
      // Fallback para navegadores mais antigos
      mediaQuery.addListener(handleChange);
      return () => mediaQuery.removeListener(handleChange);
    }
  }, []);

  return prefersReducedMotion;
};

/**
 * 🎬 HELPER: getMotionProps
 * 
 * Retorna props vazias se motion estiver desabilitado
 * Usa as props normais se motion estiver habilitado
 * 
 * @example
 * const motionProps = getMotionProps(prefersReducedMotion, {
 *   initial: { opacity: 0 },
 *   animate: { opacity: 1 }
 * });
 */
export const getMotionProps = (prefersReducedMotion, props) => {
  if (prefersReducedMotion) {
    return {};
  }
  return props;
};

/**
 * 🔧 HELPER: getTransition
 * 
 * Retorna transição instantânea se motion estiver desabilitado
 * Retorna transição normal se motion estiver habilitado
 */
export const getTransition = (prefersReducedMotion, transition = {}) => {
  if (prefersReducedMotion) {
    return { duration: 0.001 };
  }
  return transition;
};
