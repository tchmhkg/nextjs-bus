import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import Kmb from 'js-kmb-api';
import dynamic from 'next/dynamic';

import useTranslation from '~/hooks/useTranslation';
import { useStorage } from '~/hooks/useStorage';

import SearchInput from '~/components/common/input';
import { useWindowSize } from '~/hooks/useWindowSize';

const Routes = dynamic(import('~/components/kmb/routes'));
const MobileStops = dynamic(import('~/components/kmb/mobile-stops'));
const Stops = dynamic(import('~/components/kmb/stops'));

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
  const { locale } = useTranslation();
  const {localStorage, sessionStorage} = useStorage();
  const { width: windowWidth } = useWindowSize();
  const [kmb, setKmb] = useState(new Kmb(locale === 'zh' ? 'zh-hant' : 'en', localStorage, sessionStorage));
  const [busNumber, setBusNumber] = useState('');
  const [routes, setRoutes] = useState([]);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [stops, setStops] = useState([]);
  const [clickedSuggestion, setClickedSuggestion] = useState(false);
  const [showBottomSheet, setShowBottomSheet] = useState(false);
  const [loadingRoutes, setLoadingRoutes] = useState(false);
  const [loadingStops, setLoadingStops] = useState(false);
  const [selectedRouteDesc, setSelectedRouteDesc] = useState(null);

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

  const onClickSuggestion = async (route) => {
    setClickedSuggestion(true);
    setBusNumber(route);
    getRoutes(route);
    // setClickedSuggestion(false);
  }

  const getRoutes = async (routeNumber) => {
    if(!busNumber && !routeNumber) return;
    const number = (routeNumber || busNumber).toString();
    setLoadingRoutes(true);
    setRoutes([]);
    setStops([]);
    const busRoutes = await kmb?.getRoutes(number?.toUpperCase());
    if(busRoutes) {
      let results = [];
      for(let i = 0; i < busRoutes.length; i++) {
        const busVariant = (await busRoutes[i].getVariants()).sort((a, b) => a.serviceType - b.serviceType)[0];
        results.push(busVariant);
      } 
      setRoutes(results);

      const isSelectedBefore = (selectedRoute?.route?.number === number.toUpperCase()) ? results.find(route => {
        return (route.route.number === selectedRoute.route.number) && (route.route.bound === selectedRoute.route.bound);
      }) : false;
      if(isSelectedBefore) {
        getStopsFromRoute(isSelectedBefore);
      }
    }
    setLoadingRoutes(false);
  }

  const getStopsFromRoute = async route => {
    setLoadingStops(true);
    setStops([]);
    const stoppings = await route?.getStoppings();
    // console.log(stoppings);
    setStops(stoppings);
    setLoadingStops(false);
    // if(windowWidth < 769) {
    //   setShowBottomSheet(true);
    // }
  }

  const onClickRoute = (route) => {
    setSelectedRoute(route);
    setSelectedRouteDesc(route?.route?.number + " - " + route?.getOriginDestinationString?.())
    if(windowWidth < 769) {
      setShowBottomSheet(true);
    }

  }

  return (
    <Container>
      <Header>
        <Heading>Next Bus</Heading>
      </Header>
      <div>
        <SearchInput
          onChange={setBusNumber} 
          value={busNumber}
          onFocus={() => setClickedSuggestion(false)}
          // onClickButton={getRoutes}
          onClickSuggestion={onClickSuggestion}
          clickedSuggestion={clickedSuggestion}
        />
        <Routes loading={loadingRoutes} routes={routes} onClickRoute={onClickRoute}/>
        {windowWidth < 769 ? <MobileStops loading={loadingStops} showBottomSheet={showBottomSheet} setShowBottomSheet={setShowBottomSheet} routeDesc={selectedRouteDesc} stops={stops} /> : <Stops loading={loadingStops} stops={stops} />}
      </div>
    </Container>
  );
};
export default React.memo(Home);
