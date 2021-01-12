import dynamic from 'next/dynamic';
import React, { useEffect, useState } from 'react';
import Layout from "~/components/layout";
import { BUS_ROUTES } from '~/utils/bus-routes';
const Home = dynamic(import('~/components/home'), {ssr: false});

const IndexPage = () => {
  const [loading, setLoading] = useState(false);
  // useEffect(() => {
  //   const getKmbRoutesList = async () => {
  //     try {
  //       setLoading(true);
  //       const busList = await window.localStorage.getItem("kmb_routes_list");

  //       if(busList !== null) return setLoading(false);
  //       window.localStorage.setItem('kmb_routes_list',BUS_ROUTES);
  //       setLoading(false);
  //     } catch (err) {
  //       console.log(err);
  //       setLoading(false);
  //     }
  //   }
  //   getKmbRoutesList();
  // }, [])

  if(loading) return null;
  return (
    <Layout home>
      <Home />
    </Layout>
  );
};
export default IndexPage;


//http://search.kmb.hk/kmbwebsite/Function/FunctionRequest.ashx?action=getdistricts