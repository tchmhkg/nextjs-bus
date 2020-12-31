import React from 'react';
import useTranslation from '~/hooks/useTranslation';

const Route = ({route, onClick = () => {}}) => {
  const { t } = useTranslation();
  return (
    <div onClick={() => onClick(route)}>
        <div><span>{t('To')}</span> {route?.destination}</div>
    </div>
  );
};
export default React.memo(Route);
