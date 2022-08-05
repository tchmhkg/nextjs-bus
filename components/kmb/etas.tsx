import useTranslation from '@hooks/useTranslation';
import { getEtaByStop } from '@services/kmb-service';
import { getBusState } from '@store/slices/busSlice';
import { useSelector } from '@store/store';
import { getStringByLocale } from '@utils/index';
import moment from 'moment';
import { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  .eta-item {
    margin-left: 15px;
    font-size: 16px;
  }
`;

const Etas = ({ stopId, setRefresh = (shouldRefresh: boolean) => undefined, refresh = false }) => {
  const [times, setTimes] = useState([]);
  const [loading, setLoading] = useState(false);
  const { routeDirection } = useSelector(getBusState)
  const { t, locale } = useTranslation();

  const getSchedules = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getEtaByStop(routeDirection, stopId);
      if (response?.data) {
        const etaData = response.data.filter(item => item.dir === routeDirection.bound)
        setTimes(etaData);
      }
      if (refresh) {
        setRefresh(false);
      }
      setLoading(false);
    } catch (err) {
      console.log(err);
      if (refresh) {
        setRefresh(false);
      }
      setLoading(false);
    }
  }, [refresh, routeDirection, setRefresh, stopId])

  useEffect(() => {
    if (stopId) {
      getSchedules();
    }
  }, [getSchedules, stopId]);

  useEffect(() => {
    if (refresh) {
      getSchedules();
    }
  }, [getSchedules, refresh]);

  //   if (!times || !times?.length) return null;

  const renderRemark = (time) => {
    const remark = getStringByLocale(time, 'rmk', locale)
    if (!remark) return ''

    return ` (${remark})`
  }

  return (
    <Container>
      {loading
        ? <div className="eta-item">{t('Loading...')}</div>
        : ((times && times.length) ? times?.map((time, i) => {

          return (
            <div className="eta-item" key={time.eta_seq + i}>
              {`${time.eta ? moment(time.eta).format('HH:mm') : ''}${renderRemark(time)}`}
            </div>
          );
        }) : <div className="eta-item">{t('No schedule')}</div>)}
    </Container>
  );
};

export default Etas;
