import React from 'react';
import dynamic from 'next/dynamic';
import styled from 'styled-components';

const Head = dynamic(import('~/components/head'));
const Navbar = dynamic(import('~/components/navbar'));
const BackButton = dynamic(import('~/components/back'));
const BottomNav = dynamic(import('~/components/bottom-nav'));

const Container = styled.div`
  flex: 1;
  top: 70px;
  padding: 15px;
  position: relative;
  color: ${props => props.theme.text};
  a {
    color: ${props => props.theme.text};
  };
  main {
    margin-bottom: 60px;
  }
`;

const Layout = ({ children, back = false, ...props }) => {
  return (
    <>
    <Navbar />
    <Container>
      <Head />
      {back && <BackButton backUrl={props.backUrl}/>}
      <main>{children}</main>
    </Container>
    <BottomNav />
    </>
  );
};

export default Layout;
