import useTranslation from '@hooks/useTranslation';
import Axios from 'axios';
import { format } from 'date-fns';
import { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  .eta-item {
    margin-left: 15px;
    font-size: 16px;
  }
`;

const Etas = ({ stopping, setRefresh = (shouldRefresh: boolean) => { }, refresh = false }) => {
  const [times, setTimes] = useState([]);
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();

  const getSchedules = useCallback(async () => {
    try {
      setLoading(true);
      const res = await Axios.get('/api/bus/kmb-eta', {
        params: { stopping: JSON.stringify(stopping) },
      });
      if (res?.data?.data) {
        setTimes(res?.data?.data);
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
  }, [refresh, setRefresh, stopping])

  useEffect(() => {
    if (stopping) {
      getSchedules();
    }
  }, [getSchedules, stopping]);

  useEffect(() => {
    if (refresh) {
      getSchedules();
    }
  }, [getSchedules, refresh]);

  //   if (!times || !times?.length) return null;

  return (
    <Container>
      {loading
        ? <div className="eta-item">{t('Loading...')}</div>
        : ((times && times.length) ? times?.map((time, i) => {
          if (!time.realtime && time.remark) {
            return (
              <div className="eta-item" key={time.time + i}>{`${format(
                new Date(time.time),
                'HH:mm'
              )} (${t(time.remark)})`}</div>
            );
          }
          return (
            <div className="eta-item" key={time.time + i}>
              {format(new Date(time.time), 'HH:mm')}
            </div>
          );
        }) : <div className="eta-item">{t('No schedule')}</div>)}
    </Container>
  );
};

export default Etas;
