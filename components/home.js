import useTranslation from '~/hooks/useTranslation';
import styled from 'styled-components';
import React, { useEffect, useState } from 'react';
import Kmb from 'js-kmb-api';
import { useStorage } from '~/hooks/useStorage';
import axios from 'axios';
import Etas from './kmb/etas';

const Heading = styled.h2`
  color: ${(props) => props.theme.text};
  margin: 0 0 5px 0;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  font-size: 18px;
  @media (max-width: 374px) {
    font-size: 16px;
  }
`;

const Home = () => {
  const { locale, t } = useTranslation();
  const {localStorage, sessionStorage} = useStorage();
  const [kmb, setKmb] = useState(null);
  const [busNumber, setBusNumber] = useState('');
  const [routes, setRoutes] = useState([]);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [stops, setStops] = useState([]);

  useEffect(() => {
    if(localStorage && sessionStorage) {
      setKmb(new Kmb(locale === 'zh' ? 'zh-hant' : 'en', localStorage, sessionStorage))
    }
  }, [localStorage, sessionStorage, locale]);

  useEffect(() => {
    if(busNumber) {
      getRoutes();
    }
  }, [kmb]);

  useEffect(() => {
    if(selectedRoute) {
      getStopsFromRoute(selectedRoute);
    }
  }, [selectedRoute])

  const getRoutes = async () => {
    if(!busNumber) return;
    setRoutes([]);
    setStops([]);
    const busRoutes = await kmb.getRoutes(busNumber?.toUpperCase());
    if(busRoutes) {
      let results = [];
      for(let i = 0; i < busRoutes.length; i++) {
        const busVariant = (await busRoutes[i].getVariants()).sort((a, b) => a.serviceType - b.serviceType)[0];
        results.push(busVariant);
      } 
      setRoutes(results);

      const isSelectedBefore = (selectedRoute?.route?.number === busNumber.toUpperCase()) ? results.find(route => {
        return (route.route.number === selectedRoute.route.number) && (route.route.bound === selectedRoute.route.bound);
      }) : false;
      if(isSelectedBefore) {
        getStopsFromRoute(isSelectedBefore);
      }
    }
  }

  const getStopsFromRoute = async route => {
    setStops([]);
    const stoppings = await route?.getStoppings();
    setStops(stoppings);
  }

  return (
    <Container>
      <Header>
        <Heading>Next Bus</Heading>
      </Header>
      <div>
        <input onChange={(e) => setBusNumber(e.target.value)} value={busNumber} />
        <button onClick={getRoutes}>Submit</button>
        <div>
          <h5>Routes</h5>
          <ul>
          {routes?.map(route => (
            <li key={`${route?.route?.number}_${route?.route?.bound}`} onClick={() => setSelectedRoute(route)}>
              <div>{t('From')}: {route.origin}</div>
              <div>{t('To')}: {route.destination}</div>
            </li>
          ))}
          </ul>
        </div>
        <div>
          <h5>Bus stops</h5>
          <ol>
            {stops?.map(stop => {
              return (
                <li key={`${stop?.stop?.id}_${stop?.sequence}_${locale}`}>{stop?.stop?.name} <Etas stopping={stop} /></li>
              )
            })}
          </ol>
        </div>
      </div>
    </Container>
  );
};
export default React.memo(Home);
