import Layout from "@components/layout";
import { getKmbRoutes } from '@services/kmb-service';
import { setRouteNumList, setRoutes } from '@store/slices/busSlice';
import dynamic from 'next/dynamic';
import { useCallback, useLayoutEffect } from 'react';
import { useDispatch } from 'react-redux';

const Home = dynamic(import('@components/home'), {ssr: false});

const IndexPage = () => {
  const dispatch = useDispatch()
  
  const updateRoutes = useCallback(async () => {
    const response = await getKmbRoutes();
    if (response) {
      dispatch(setRoutes(response.routes))
      dispatch(setRouteNumList(response.routeNumList))
    }
  }, [dispatch])

  useLayoutEffect(() => {
    updateRoutes()
  }, [updateRoutes])

  return (
    <Layout home>
      <Home />
    </Layout>
  );
};
export default IndexPage;


//http://search.kmb.hk/kmbwebsite/Function/FunctionRequest.ashx?action=getdistricts