import { useEffect, useRef } from "react";

type IntervalCallback = () => (unknown | void);

export function useInterval(
  callback: IntervalCallback,
  delay: number
): void {
  const saved_callback = useRef<IntervalCallback | null>(null);

  // Remember the latest callback.
  useEffect(() => {
    saved_callback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    function tick() {
      if (saved_callback.current !== null)
        saved_callback.current();
    }
    if (delay !== null) {
      const id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}