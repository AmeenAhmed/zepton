

export function fade({ delay = 0, duration = 400, easing = 'linear'} = {}) {
  return {
    delay,
    duration,
    easing,
    in: {
      opacity: [0, 1],
    },
    out: {
      opacity: [1, 0],
    }
  };
}

export function zoom({ delay = 0, duration = 400, easing = 'ease-in-out'} = {}) {
  return {
    delay,
    duration,
    easing,
    in: {
      transform: ['scale(0.0001)', 'scale(1)'],
    },
    out: {
      transform: ['scale(1)', 'scale(0.0001)'],
    }
  };
}

export function slideDown({ delay = 0, duration = 400, easing = 'ease-in-out'} = {}) {
  return {
    delay,
    duration,
    easing,
    in: {
      transform: ['translateY(-20px)', 'translateY(0)'],
    },
    out: {
      transform: ['translateY(0)', 'translateY(20px)'],
    }
  };
}

export function slideUp({ delay = 0, duration = 400, easing = 'linear'} = {}) {
  return {
    delay,
    duration,
    easing,
    in: {
      transform: ['translateY(20px)', 'translateY(0)'],
    },
    out: {
      transform: ['translateY(0)', 'translateY(-20px)'],
    }
  };
}

export function slideLeft({ delay = 0, duration = 400, easing = 'linear'} = {}) {
  return {
    delay,
    duration,
    easing,
    in: {
      transform: ['translateX(20px)', 'translateX(0)'],
    },
    out: {
      transform: ['translateX(0)', 'translateX(-20px)'],
    }
  };
}

export function slideRight({ delay = 0, duration = 400, easing = 'linear'} = {}) {
  return {
    delay,
    duration,
    easing,
    in: {
      transform: ['translateX(-20px)', 'translateX(0)'],
    },
    out: {
      transform: ['translateX(0)', 'translateX(20px)'],
    }
  };
}

export function fadeDown({ delay = 0, duration = 400, easing = 'linear'} = {}) {
  return {
    delay,
    duration,
    easing,
    in: {
      opacity: [0, 1],
      transform: ['translateY(-20px)', 'translateY(0)'],
    },
    out: {
      opacity: [1, 0],
      transform: ['translateY(0)', 'translateY(20px)'],
    }
  };
}

export function fadeUp({ delay = 0, duration = 400, easing = 'linear'} = {}) {
  return {
    delay,
    duration,
    easing,
    in: {
      opacity: [0, 1],
      transform: ['translateY(20px)', 'translateY(0)'],
    },
    out: {
      opacity: [1, 0],
      transform: ['translateY(0)', 'translateY(-20px)'],
    }
  };
}

export function fadeLeft({ delay = 0, duration = 400, easing = 'linear'} = {}) {
  return {
    delay,
    duration,
    easing,
    in: {
      opacity: [0, 1],
      transform: ['translateX(20px)', 'translateX(0)'],
    },
    out: {
      opacity: [1, 0],
      transform: ['translateX(0)', 'translateX(-20px)'],
    }
  };
}

export function fadeRight({ delay = 0, duration = 400, easing = 'linear'} = {}) {
  return {
    delay,
    duration,
    easing,
    in: {
      opacity: [0, 1],
      transform: ['translateX(-20px)', 'translateX(0)'],
    },
    out: {
      opacity: [1, 0],
      transform: ['translateX(0)', 'translateX(20px)'],
    }
  };
}
