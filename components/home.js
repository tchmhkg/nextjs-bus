import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import Kmb from 'js-kmb-api';

import useTranslation from '~/hooks/useTranslation';
import { useStorage } from '~/hooks/useStorage';

import Stops from '~/components/kmb/stops';
import MobileStops from '~/components/kmb/mobile-stops';
import Routes from '~/components/kmb/routes';
import SearchInput from '~/components/common/input';
import { useWindowSize } from '~/hooks/useWindowSize';

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
  const [kmb, setKmb] = useState(null);
  const [busNumber, setBusNumber] = useState('');
  const [routes, setRoutes] = useState([]);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [stops, setStops] = useState([]);
  const [clickedSuggestion, setClickedSuggestion] = useState(false);
  const [showBottomSheet, setShowBottomSheet] = useState(false);

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
  }

  const getRoutes = async (routeNumber) => {
    if(!busNumber && !routeNumber) return;
    const number = (routeNumber || busNumber).toString();
    setRoutes([]);
    setStops([]);
    const busRoutes = await kmb.getRoutes(number?.toUpperCase());
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
    setClickedSuggestion(false);
  }

  const getStopsFromRoute = async route => {
    setStops([]);
    const stoppings = await route?.getStoppings();
    // console.log(stoppings);
    setStops(stoppings);
    // if(windowWidth < 769) {
    //   setShowBottomSheet(true);
    // }
  }

  const onClickRoute = (route) => {
    setSelectedRoute(route);
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
          // onClickButton={getRoutes}
          onClickSuggestion={onClickSuggestion}
          clickedSuggestion={clickedSuggestion}
        />
        <Routes routes={routes} onClickRoute={onClickRoute}/>
        {windowWidth < 769 ? <MobileStops showBottomSheet={showBottomSheet} setShowBottomSheet={setShowBottomSheet} stops={stops} /> : <Stops stops={stops} />}
      </div>
    </Container>
  );
};
export default React.memo(Home);
