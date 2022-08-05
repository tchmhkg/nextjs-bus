import SearchInput from '@components/common/input';
import useTranslation from '@hooks/useTranslation';
import { useWindowSize } from '@hooks/useWindowSize';
import { getBusState } from '@store/slices/busSlice';
import dynamic from 'next/dynamic';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';

const Routes = dynamic(import('@components/kmb/routes'));
const MobileStops = dynamic(import('@components/kmb/mobile-stops'));
const Stops = dynamic(import('@components/kmb/stops'));

// const Heading = styled.h2`
//   color: ${(props) => props.theme.text};
//   margin: 0 0 5px 0;
// `;

// const Header = styled.div`
//   display: flex;
//   justify-content: space-between;
//   align-items: center;
// `;

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
  const { width: windowWidth } = useWindowSize();
  // const kmb = useKmb();
  const [busNumber, setBusNumber] = useState('');
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [stops, setStops] = useState([]);
  const [clickedSuggestion, setClickedSuggestion] = useState(false);
  const [showBottomSheet, setShowBottomSheet] = useState(false);
  const [loadingRoutes, setLoadingRoutes] = useState(false);
  const [loadingStops, setLoadingStops] = useState(false);
  const [selectedRouteDesc, setSelectedRouteDesc] = useState(null);

  const { routeNumList, routes } = useSelector(getBusState)

  // useEffect(() => {
  //   if(busNumber) {
  //     getRoutes();
  //   }
  // }, [kmb]);

  useEffect(() => {
    if (selectedRoute) {
      getStopsFromRoute(selectedRoute);
    }
  }, [selectedRoute])

  const onClickSuggestion = () => {
    setClickedSuggestion(true);
    // setBusNumber(route);
    // getRoutes(route);
    // setClickedSuggestion(false);
  }

  const getRoutes = async (routeNumber) => {
    if (!busNumber && !routeNumber) return;
    const number = (routeNumber || busNumber).toString();
    setLoadingRoutes(true);
    const busRoutes = []//await kmb?.getRoutes(number?.toUpperCase());
    // if (busRoutes) {
    //   let results = [];
    //   for (let i = 0; i < busRoutes.length; i++) {
    //     const busVariant = (await busRoutes[i].getVariants()).sort((a, b) => a.serviceType - b.serviceType)[0];
    //     results.push(busVariant);
    //   }

    //   const isSelectedBefore = (selectedRoute?.route?.number === number.toUpperCase()) ? results.find(route => {
    //     return (route.route.number === selectedRoute.route.number) && (route.route.bound === selectedRoute.route.bound);
    //   }) : false;
    //   if (isSelectedBefore) {
    //     getStopsFromRoute(isSelectedBefore);
    //   }
    // }
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

  const onClickRoute = () => {
    // setSelectedRoute(route);
    // const oriDestString = `${getStringByLocale(route, 'origin', locale)} ${String.fromCodePoint(0x2192)} ${getStringByLocale(route, 'destination', locale)}`
    // setSelectedRouteDesc(route?.route?.number + " - " + oriDestString)
    if (windowWidth < 769) {
      setShowBottomSheet(true);
    }

  }

  return (
    <Container>
      {/* <Header>
        <Heading>Next Bus</Heading>
      </Header> */}
      <div>
        <SearchInput
          onChange={setBusNumber}
          value={busNumber}
        />
        <Routes loading={loadingRoutes} onClickRoute={onClickRoute} />
        {windowWidth < 769 ? <MobileStops loading={loadingStops} showBottomSheet={showBottomSheet} setShowBottomSheet={setShowBottomSheet} routeDesc={selectedRouteDesc} /> : <Stops loading={loadingStops} />}
      </div>
    </Container>
  );
};
export default React.memo(Home);
