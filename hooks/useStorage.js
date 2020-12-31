import { useEffect, useRef } from 'react';

export function useStorage() {
  const ref = useRef({});
  useEffect(() => {
    ref.current = {localStorage: window.localStorage, sessionStorage: window.sessionStorage};
  });
  return ref.current;
}
