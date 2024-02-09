import { useEffect, useRef, useState } from "react";

type Timer = ReturnType<typeof setTimeout>;

export function useDebounce(func: Function, delay = 1000) {
  const timer = useRef<Timer>();

  useEffect(() => {
    return () => {
      if (timer.current) {
        clearTimeout(timer.current);
      }
    };
  }, []);

  const debouncedFunction = (...args: any[]) => {
    if (timer.current) {
      clearTimeout(timer.current);
    }
    const newTimer = setTimeout(() => {
      func(...args);
    }, delay);

    timer.current = newTimer;
  };

  return debouncedFunction;
}
