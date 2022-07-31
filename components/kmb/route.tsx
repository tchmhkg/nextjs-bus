import useTranslation from '@hooks/useTranslation';
import { getStringByLocale } from '@utils/index';
import React from 'react';

const Route = ({ route, onClick = (route) => { } }) => {
  const { t, locale } = useTranslation();
  return (
    <div onClick={() => onClick(route)}>
      <div><span>{t('To')}</span> {getStringByLocale(route, 'destination', locale)}</div>
    </div>
  );
};
export default React.memo(Route);
