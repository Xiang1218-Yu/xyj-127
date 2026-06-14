import type { Transition } from 'framer-motion';

export const transitions = {
  springSoft: { type: 'spring', damping: 30, stiffness: 200 } as Transition,
  springStandard: { type: 'spring', damping: 25, stiffness: 300 } as Transition,
  springBouncy: { type: 'spring', damping: 20, stiffness: 300 } as Transition,
  springHeader: { type: 'spring', damping: 20 } as Transition,
  easeFast: { duration: 0.2, ease: 'easeInOut' } as Transition,
  easeStandard: { duration: 0.25, ease: 'easeInOut' } as Transition,
  easeSlow: { duration: 0.3, ease: 'easeInOut' } as Transition,
} as const;

export const buttonTaps = {
  subtle: { whileHover: { scale: 1.02 }, whileTap: { scale: 0.98 } },
  standard: { whileHover: { scale: 1.05 }, whileTap: { scale: 0.95 } },
  icon: { whileHover: { scale: 1.1 }, whileTap: { scale: 0.9 } },
  emoji: { whileHover: { scale: 1.15 }, whileTap: { scale: 0.9 } },
} as const;

export const fadeInOut = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

export const modalOverlay = { ...fadeInOut };

export const modalContent = {
  initial: { scale: 0.9, opacity: 0 },
  animate: { scale: 1, opacity: 1 },
  exit: { scale: 0.9, opacity: 0 },
};

export const modalContentSpring = {
  initial: { scale: 0.9, opacity: 0, transition: transitions.springStandard },
  animate: { scale: 1, opacity: 1, transition: transitions.springStandard },
  exit: { scale: 0.9, opacity: 0, transition: transitions.springStandard },
};

export const modalContentWithOffset = {
  initial: { scale: 0.9, y: 20, opacity: 0 },
  animate: { scale: 1, y: 0, opacity: 1 },
  exit: { scale: 0.9, y: 20, opacity: 0 },
};

export const modalContentSpringOffset = {
  initial: { scale: 0.9, y: 20, opacity: 0, transition: transitions.springStandard },
  animate: { scale: 1, y: 0, opacity: 1, transition: transitions.springStandard },
  exit: { scale: 0.9, y: 20, opacity: 0, transition: transitions.springStandard },
};

export const slideInRight = {
  initial: { x: '100%' },
  animate: { x: 0 },
  exit: { x: '100%' },
};

export const slideInRightSpring = {
  initial: { x: '100%', transition: transitions.springSoft },
  animate: { x: 0, transition: transitions.springSoft },
  exit: { x: '100%', transition: transitions.springSoft },
};

export const slideInLeft = {
  initial: { x: -100, opacity: 0 },
  animate: { x: 0, opacity: 1 },
  exit: { x: -100, opacity: 0 },
};

export const slideInLeftSpring = {
  initial: { x: -100, opacity: 0, transition: transitions.springBouncy },
  animate: { x: 0, opacity: 1, transition: transitions.springBouncy },
  exit: { x: -100, opacity: 0, transition: transitions.springBouncy },
};

export const slideInRightFade = {
  initial: { x: 100, opacity: 0 },
  animate: { x: 0, opacity: 1 },
  exit: { x: 100, opacity: 0 },
};

export const slideInRightSpringFade = {
  initial: { x: 100, opacity: 0, transition: transitions.springHeader },
  animate: { x: 0, opacity: 1, transition: transitions.springHeader },
  exit: { x: 100, opacity: 0, transition: transitions.springHeader },
};

export const slideInTop = {
  initial: { y: -100, opacity: 0 },
  animate: { y: 0, opacity: 1 },
  exit: { y: -100, opacity: 0 },
};

export const slideInTopSpring = {
  initial: { y: -100, opacity: 0, transition: transitions.springHeader },
  animate: { y: 0, opacity: 1, transition: transitions.springHeader },
  exit: { y: -100, opacity: 0, transition: transitions.springHeader },
};

export const slideInBottom = {
  initial: { y: 100, opacity: 0 },
  animate: { y: 0, opacity: 1 },
  exit: { y: 100, opacity: 0 },
};

export const slideInBottomSpring = {
  initial: { y: 100, opacity: 0, transition: transitions.springHeader },
  animate: { y: 0, opacity: 1, transition: transitions.springHeader },
  exit: { y: 100, opacity: 0, transition: transitions.springHeader },
};

export const collapseExpand = {
  initial: { height: 0, opacity: 0 },
  animate: { height: 'auto', opacity: 1 },
  exit: { height: 0, opacity: 0 },
};

export const collapseExpandFast = {
  initial: { height: 0, opacity: 0, transition: transitions.easeFast },
  animate: { height: 'auto', opacity: 1, transition: transitions.easeFast },
  exit: { height: 0, opacity: 0, transition: transitions.easeFast },
};

export const collapseExpandStandard = {
  initial: { height: 0, opacity: 0, transition: transitions.easeStandard },
  animate: { height: 'auto', opacity: 1, transition: transitions.easeStandard },
  exit: { height: 0, opacity: 0, transition: transitions.easeStandard },
};

export const collapseExpandSlow = {
  initial: { height: 0, opacity: 0, transition: transitions.easeSlow },
  animate: { height: 'auto', opacity: 1, transition: transitions.easeSlow },
  exit: { height: 0, opacity: 0, transition: transitions.easeSlow },
};

export const rotateExpand = {
  animate: { rotate: 180 },
  initial: { rotate: 0 },
};

export const rotateExpandFast = {
  animate: { rotate: 180, transition: transitions.easeFast },
  initial: { rotate: 0, transition: transitions.easeFast },
};

export const rotateExpandStandard = {
  animate: { rotate: 180, transition: transitions.easeStandard },
  initial: { rotate: 0, transition: transitions.easeStandard },
};

export function staggerContainer(delayChildren = 0.05, staggerChildren = 0.05) {
  return {
    animate: {
      transition: {
        delayChildren,
        staggerChildren,
      },
    },
  };
}

export function staggerItem(
  direction: 'left' | 'right' | 'up' | 'down' = 'right',
  offset = 50,
) {
  const axis = direction === 'left' || direction === 'right' ? 'x' : 'y';
  const value =
    direction === 'left' ? -offset :
    direction === 'right' ? offset :
    direction === 'up' ? -offset : offset;
  return {
    initial: { [axis]: value, opacity: 0 },
    animate: { [axis]: 0, opacity: 1 },
  };
}

export const fadeSlideY = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
};

export const fadeSlideX = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 },
};

export const fadeSlideXSlow = {
  initial: { opacity: 0, x: 20, transition: transitions.easeSlow },
  animate: { opacity: 1, x: 0, transition: transitions.easeSlow },
  exit: { opacity: 0, x: -20, transition: transitions.easeSlow },
};

export const pulseHeartbeat = {
  animate: {
    scale: [1, 1.3, 1],
    opacity: [0.5, 0, 0.5],
    transition: { duration: 2, repeat: Infinity },
  },
};

export const breathScale = {
  animate: {
    scale: [1, 1.05, 1],
    transition: { duration: 2, repeat: Infinity },
  },
};

export function breathScaleCustom(duration = 1.5) {
  return {
    animate: {
      scale: [1, 1.05, 1],
      transition: { duration, repeat: Infinity },
    },
  };
}

export const rotateInfinite = {
  animate: {
    rotate: 360,
    transition: { duration: 2, repeat: Infinity, ease: 'linear' as const },
  },
};

export function rotateInfiniteCustom(duration = 2) {
  return {
    animate: {
      rotate: 360,
      transition: { duration, repeat: Infinity, ease: 'linear' as const },
    },
  };
}

export function audioWave(delay = 0, duration = 0.8) {
  return {
    animate: {
      height: [4, 12, 4],
      transition: {
        duration,
        repeat: Infinity,
        delay,
        ease: 'easeInOut' as const,
      },
    },
  };
}

export function audioWaveSmall(delay = 0, duration = 0.8) {
  return {
    animate: {
      height: [3, 8, 3],
      transition: {
        duration,
        repeat: Infinity,
        delay,
        ease: 'easeInOut' as const,
      },
    },
  };
}

export function glowPulse(baseSize: number, intensity = 1) {
  return {
    initial: { opacity: 0.5, r: baseSize },
    animate: {
      opacity: [0.3, 0.6, 0.3],
      r: [baseSize * 1.5, baseSize * 2.5, baseSize * 1.5],
      transition: {
        duration: 2 + intensity * 0.5,
        repeat: Infinity,
        ease: 'easeInOut' as const,
      },
    },
  };
}
