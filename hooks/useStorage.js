import { useEffect, useState } from 'react';

export function useStorage() {
  const [_localStorage, setLocalStorage] = useState(null);
  const [_sessionStorage, setSessionStorage] = useState(null);
  useEffect(() => {
    setLocalStorage(window.localStorage);
    setSessionStorage(window.sessionStorage);
  });
  return {localStorage: _localStorage, sessionStorage: _sessionStorage};
}
