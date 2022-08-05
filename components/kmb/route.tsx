import useTranslation from '@hooks/useTranslation';
import { getStops } from '@services/kmb-service';
import { IRoute, setStops } from '@store/slices/busSlice';
import { getStringByLocale } from '@utils/index';
import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';

const Route = ({ route, onClick = (route) => { } }) => {
  const dispatch = useDispatch()
  const { t, locale } = useTranslation();

  const getStopsByDirection = useCallback(async (direction: IRoute) => {
    const response = await getStops(direction);
    if (response) {
      console.log("🚀 ~ file: route.tsx ~ line 15 ~ getStopsByDirection ~ response", response)
      dispatch(setStops(response))
    }
  }, [dispatch])

  return (
    <div onClick={() => getStopsByDirection(route)}>
      <div><span>{t('To')}</span> {getStringByLocale(route, 'dest', locale)}</div>
    </div>
  );
};
export default React.memo(Route);
