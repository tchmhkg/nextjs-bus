import axios from 'axios';
import dynamic from 'next/dynamic';
import React, { useEffect, useState } from 'react';
import Layout from "~/components/layout";
import { getKmbRoutes } from '~/services/kmb-service';

const Home = dynamic(import('~/components/home'), {ssr: false});

const IndexPage = () => {
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const getKmbRoutesList = async () => {
      try {
        setLoading(true);
        const busList = window.localStorage["KMB_ROUTES_LIST"];
        if(busList) return setLoading(false);
        const routes = await getKmbRoutes();

        if(routes) {
          window.localStorage.KMB_ROUTES_LIST = routes;
        }
        setLoading(false);
      } catch (err) {
        console.log(err);
        setLoading(false);
      }
    }
    getKmbRoutesList();
  }, [])

  if(loading) return null;
  return (
    <Layout home>
      <Home />
    </Layout>
  );
};
export default IndexPage;


//http://search.kmb.hk/kmbwebsite/Function/FunctionRequest.ashx?action=getdistricts