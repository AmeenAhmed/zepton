

export function fade({ delay = 0, duration = 400, easing = 'ease-in-out'} = {}) {
  return {
    delay,
    duration,
    easing,
    in: {
      opacity: [0, 1],
    },
    out: {
      opacity: [0, 1],
    }
  };
}
