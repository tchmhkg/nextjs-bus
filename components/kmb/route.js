import React from 'react';
import useTranslation from '~/hooks/useTranslation';
import { getStringByLocale } from '~/utils';

const Route = ({route, onClick = () => {}}) => {
  const { t, locale } = useTranslation();
  return (
    <div onClick={() => onClick(route)}>
        <div><span>{t('To')}</span> {getStringByLocale(route, 'destination', locale)}</div>
    </div>
  );
};
export default React.memo(Route);
