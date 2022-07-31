import dynamic from 'next/dynamic';
import React from 'react';
import Layout from "@components/layout";

const Home = dynamic(import('@components/home'), {ssr: false});

const IndexPage = () => {
  return (
    <Layout home>
      <Home />
    </Layout>
  );
};
export default IndexPage;


//http://search.kmb.hk/kmbwebsite/Function/FunctionRequest.ashx?action=getdistricts