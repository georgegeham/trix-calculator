import { useEffect, useRef, useState } from 'react';
import { reducedMotion } from '../lib/effects';

/** Counts a number up or down to its new value. */
export function useTween(target: number, duration = 850) {
  const [value, setValue] = useState(target);
  const from = useRef(target);

  useEffect(() => {
    const start = from.current;
    if (start === target || reducedMotion()) {
      from.current = target;
      setValue(target);
      return;
    }
    const t0 = performance.now();
    let raf = 0;
    const step = (now: number) => {
      const k = Math.min(1, (now - t0) / duration);
      const eased = 1 - Math.pow(1 - k, 3);
      setValue(Math.round(start + (target - start) * eased));
      if (k < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => {
      cancelAnimationFrame(raf);
      from.current = target;
    };
  }, [target, duration]);

  return value;
}
