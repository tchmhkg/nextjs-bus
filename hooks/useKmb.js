import { useEffect, useState } from 'react';
import Kmb from 'js-kmb-api';
import useTranslation from './useTranslation';
import { useStorage } from './useStorage';

export function useKmb() {
  const { locale } = useTranslation();
  const { localStorage, sessionStorage } = useStorage();
  const [kmb, setKmb] = useState(
    new Kmb(locale === 'zh' ? 'zh-hant' : 'en', localStorage, sessionStorage)
  );
  useEffect(() => {
    // if (localStorage && sessionStorage) {
      setKmb(
        new Kmb(
          locale === 'zh' ? 'zh-hant' : 'en',
          localStorage,
          sessionStorage
        )
      );
    // }
  }, [locale]);
  return kmb;
}
