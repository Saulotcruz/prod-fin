export const ease = [0.22, 1, 0.36, 1]

export const revealVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease },
  },
}

export const staggerContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1 },
  },
}

export const staggerContainerFast = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.06 },
  },
}

export const viewportOnce = { once: true, margin: '-80px' }
