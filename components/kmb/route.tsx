import useTranslation from '@hooks/useTranslation';
import { getStops } from '@services/kmb-service';
import { IRoute, setRouteDirection, setStops } from '@store/slices/busSlice';
import { getStringByLocale } from '@utils/index';
import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';

const Route = ({ route, onClick = () => { } }) => {
  const dispatch = useDispatch()
  const { t, locale } = useTranslation();

  const getStopsByDirection = useCallback(async (direction: IRoute) => {
    dispatch(setRouteDirection(direction))
    dispatch(setStops(null))
    const response = await getStops(direction);
    if (response) {
      dispatch(setStops(response))
      onClick()
    }
  }, [dispatch, onClick])

  return (
    <div onClick={() => getStopsByDirection(route)}>
      <div><span>{t('To')}</span> {getStringByLocale(route, 'dest', locale)}</div>
    </div>
  );
};
export default React.memo(Route);
