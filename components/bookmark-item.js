import React, { memo, useEffect, useState } from 'react';
import styled from 'styled-components';
import Axios from 'axios';
import { format } from 'date-fns';
import useTranslation from '~/hooks/useTranslation';

const Container = styled.div`
  padding: 5px 15px;
  border-bottom: 1px solid ${(props) => props.theme.border};
  display: flex;
  align-items: center;
  justify-content: space-between;
  .eta-item {
    width: 40px;
  }
`;

const BusNumber = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    width: 40px;
`;

const RouteDetail = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    flex: .6;
    span {
        font-size: 12px;
    }
    .stop-name {
        font-size: 14px;
    }
`;

const BookmarkItem = ({ item = {} }) => {
    const {t} = useTranslation();
  return (
    <Container>
        <BusNumber>{item?.variant?.route?.number}</BusNumber>
        <RouteDetail>
            <div><span>{t('To')}</span> {item?.variant?.destination}</div>
            <div className="stop-name">{item?.stop?.name}</div>
        </RouteDetail>
        <Eta stop={item}/>
    </Container>
  );
};

const Eta = ({stop}) => {
    const [time, setTime] = useState({});
    const [loading, setLoading] = useState(false);
    useEffect(() => {
      if (stop) {
        getSchedules();
      }
    }, [stop]);
  
    const getSchedules = async () => {
      try {
        setLoading(true);
        const res = await Axios.get('/api/bus/kmb-eta', {
          params: { stopping: JSON.stringify(stop) },
        });
        if (res?.data?.data) {
            setTime(res?.data?.data?.[0]);
        }
        setLoading(false);
      } catch (err) {
        console.log(err);
        setLoading(false);
      }
    };

    return (
        <div className="eta-item">
          {(!loading && time?.time) && format(new Date(time.time), 'HH:mm')}
        </div>
      );
}

export default React.memo(BookmarkItem);
