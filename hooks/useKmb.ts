import Kmb from 'kmb-api'
import { useStorage } from './useStorage'

export function useKmb() {
  const { localStorage, sessionStorage } = useStorage()
  return new Kmb('en', localStorage, sessionStorage)
}
