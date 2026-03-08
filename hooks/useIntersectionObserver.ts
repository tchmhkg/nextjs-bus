import { useEffect, useRef, type RefObject } from "react";

export function useIntersectionObserver(
  scrollRoot: HTMLDivElement | null,
  key: string,
  onVisibleChange: (key: string, visible: boolean) => void
) {
  const ref = useRef<HTMLDivElement>(null);
  const onVisibleChangeRef = useRef(onVisibleChange);

  // Update ref when callback changes
  useEffect(() => {
    onVisibleChangeRef.current = onVisibleChange;
  }, [onVisibleChange]);

  // Set up intersection observer when component mounts
  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) return;
        onVisibleChangeRef.current(key, entry.isIntersecting);
      },
      {
        root: scrollRoot,
        rootMargin: "50px",
      }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [key, scrollRoot]);

  return ref as RefObject<HTMLDivElement>;
}