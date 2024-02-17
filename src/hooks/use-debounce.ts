import { useEffect, useRef, useState } from "react";

type Timer = ReturnType<typeof setTimeout>;

export function useDebounceFunction(func: Function, delay = 1000) {
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

export function useDebounceValue(value: any, delay = 1000) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
