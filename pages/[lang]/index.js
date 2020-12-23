import React, { useEffect } from 'react';
import Axios from 'axios';
import Layout from "~/components/layout";
import Home from "~/components/home";

const IndexPage = () => {
  useEffect(() => {
    const getKmbRoutesList = async () => {
      try {
        const res = await Axios.get('/api/bus/kmb-routes-list');
        if(res?.data?.data) {
          window.localStorage.setItem('kmb_routes_list',res?.data?.data);
        }
      } catch (err) {
        console.log(err);
      }
    }
    if (window.localStorage.getItem("kmb_routes_list") === null) {
      getKmbRoutesList();
    }
  }, [])
  return (
    <Layout home>
      <Home />
    </Layout>
  );
};
export default IndexPage;
