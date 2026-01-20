/**
 * 🎬 SISTEMA DE ANIMAÇÕES SUAVES
 * Variantes reutilizáveis para Framer Motion
 * 
 * PRINCÍPIOS:
 * - Duração: 150ms - 300ms
 * - Ease: natural (ease-out)
 * - Movimentos curtos
 * - Nunca distrair, sempre guiar
 */

// ============================================
// 🌊 NAVEGAÇÃO ENTRE PÁGINAS
// ============================================

export const pageVariants = {
  initial: {
    opacity: 0,
    y: 8
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.25,
      ease: [0.22, 1, 0.36, 1] // ease-out suave
    }
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.15,
      ease: 'easeIn'
    }
  }
};

// ============================================
// 🃏 CARDS (Roteiro, Financeiro)
// ============================================

export const cardVariants = {
  hidden: {
    opacity: 0,
    y: 12
  },
  visible: (custom = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.25,
      delay: custom * 0.04, // 40ms entre cada card
      ease: [0.22, 1, 0.36, 1]
    }
  })
};

export const cardHoverVariants = {
  rest: {
    scale: 1,
    boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)'
  },
  hover: {
    scale: 1.015,
    boxShadow: '0 10px 25px -5px rgb(0 0 0 / 0.1)',
    transition: {
      duration: 0.2,
      ease: 'easeOut'
    }
  },
  tap: {
    scale: 0.995
  }
};

// ============================================
// 🎯 BOTÕES
// ============================================

export const buttonVariants = {
  rest: {
    scale: 1
  },
  hover: {
    scale: 1.04,
    transition: {
      duration: 0.15,
      ease: 'easeOut'
    }
  },
  tap: {
    scale: 0.96,
    transition: {
      duration: 0.1
    }
  }
};

export const iconButtonVariants = {
  rest: {
    scale: 1,
    rotate: 0
  },
  hover: {
    scale: 1.1,
    transition: {
      duration: 0.2,
      ease: 'easeOut'
    }
  },
  tap: {
    scale: 0.9,
    rotate: -5
  }
};

// ============================================
// 🪟 MODAIS
// ============================================

export const modalOverlayVariants = {
  hidden: {
    opacity: 0
  },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.2,
      ease: 'easeOut'
    }
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.15,
      ease: 'easeIn'
    }
  }
};

export const modalContentVariants = {
  hidden: {
    opacity: 0,
    scale: 0.95,
    y: 20
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.25,
      ease: [0.22, 1, 0.36, 1]
    }
  },
  exit: {
    opacity: 0,
    scale: 0.98,
    y: 10,
    transition: {
      duration: 0.15,
      ease: 'easeIn'
    }
  }
};

// ============================================
// 📝 LISTAS DINÂMICAS
// ============================================

export const listItemVariants = {
  hidden: {
    opacity: 0,
    x: -20,
    height: 0
  },
  visible: (custom = 0) => ({
    opacity: 1,
    x: 0,
    height: 'auto',
    transition: {
      duration: 0.25,
      delay: custom * 0.05,
      ease: [0.22, 1, 0.36, 1]
    }
  }),
  exit: {
    opacity: 0,
    x: 20,
    height: 0,
    transition: {
      duration: 0.2,
      ease: 'easeIn'
    }
  }
};

// ============================================
// 📖 HISTÓRIA (Texto progressivo)
// ============================================

export const storyParagraphVariants = {
  hidden: {
    opacity: 0,
    y: 15
  },
  visible: (custom = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      delay: custom * 0.08, // 80ms entre parágrafos
      ease: [0.22, 1, 0.36, 1]
    }
  })
};

// ============================================
// 🎨 FEEDBACK VISUAL
// ============================================

export const successVariants = {
  hidden: {
    opacity: 0,
    scale: 0.8,
    y: -10
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: [0.34, 1.56, 0.64, 1] // slight bounce
    }
  },
  exit: {
    opacity: 0,
    scale: 0.9,
    transition: {
      duration: 0.2
    }
  }
};

// ============================================
// 🌀 LOADING STATES
// ============================================

export const skeletonVariants = {
  initial: {
    opacity: 0.5
  },
  animate: {
    opacity: [0.5, 0.8, 0.5],
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: 'easeInOut'
    }
  }
};

export const spinnerVariants = {
  animate: {
    rotate: 360,
    transition: {
      duration: 1,
      repeat: Infinity,
      ease: 'linear'
    }
  }
};

// ============================================
// 🎛️ STAGGER CONTAINERS
// ============================================

export const staggerContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1
    }
  }
};

// ============================================
// ⚙️ UTILITY: Respeitar prefers-reduced-motion
// ============================================

export const getReducedMotion = () => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

export const withReducedMotion = (variants) => {
  if (getReducedMotion()) {
    // Desabilita animações para usuários sensíveis
    return {
      initial: { opacity: 1 },
      animate: { opacity: 1 },
      exit: { opacity: 1 }
    };
  }
  return variants;
};
