import { useCallback, useEffect, useRef, type RefObject } from "react";

const SCROLL_DEBOUNCE_MS = 280;

export function useDebouncedVisibleKeys(
  visibleKeysRef: RefObject<Set<string>>,
  setVisibleKeys: (keys: string[]) => void
) {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  return useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      timeoutRef.current = null;
      if (visibleKeysRef.current) {
        setVisibleKeys(Array.from(visibleKeysRef.current));
      }
    }, SCROLL_DEBOUNCE_MS);
  }, [visibleKeysRef, setVisibleKeys]);
}

export function useScrollContainerVisibility(
  scrollContainerRef: RefObject<HTMLDivElement | null>,
  debouncedFlush: () => void
) {
  const visibleKeysRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;

    const handleScroll = () => {
      debouncedFlush();
    };

    el.addEventListener("scroll", handleScroll, { passive: true });
    return () => el.removeEventListener("scroll", handleScroll);
  }, [scrollContainerRef, debouncedFlush]);

  return visibleKeysRef;
}