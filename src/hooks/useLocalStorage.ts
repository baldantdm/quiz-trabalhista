import { useState, useCallback } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }
    try {
      const item = window.localStorage.getItem(key);
      if (!item) return initialValue;
      const parsed = JSON.parse(item) as unknown;
      if (parsed === null || parsed === undefined) {
        return initialValue;
      }
      if (typeof initialValue === 'object' && initialValue !== null) {
        if (typeof parsed !== 'object' || Array.isArray(parsed)) {
          return initialValue;
        }
        return { ...initialValue, ...(parsed as Record<string, unknown>) } as T;
      }
      if (typeof parsed !== typeof initialValue) {
        return initialValue;
      }
      return parsed as T;
    } catch {
      return initialValue;
    }
  });

  const setValue = useCallback(
    (value: T | ((val: T) => T)) => {
      try {
        setStoredValue((prev) => {
          const valueToStore = value instanceof Function ? value(prev) : value;
          if (typeof window !== 'undefined') {
            window.localStorage.setItem(key, JSON.stringify(valueToStore));
          }
          return valueToStore;
        });
      } catch {
        // Ignore storage quota or private mode errors safely
      }
    },
    [key]
  );

  const clearValue = useCallback(() => {
    try {
      setStoredValue(initialValue);
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(key);
      }
    } catch {
      // Ignore errors safely
    }
  }, [key, initialValue]);

  return [storedValue, setValue, clearValue] as const;
}
