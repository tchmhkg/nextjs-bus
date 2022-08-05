import { useEffect, useRef } from 'react'

export function useStorage() {
  const ref = useRef<{ localStorage: any; sessionStorage: any }>({
    localStorage: null,
    sessionStorage: null,
  })
  useEffect(() => {
    ref.current = {
      localStorage: window.localStorage,
      sessionStorage: window.sessionStorage,
    }
  })
  return ref.current
}
