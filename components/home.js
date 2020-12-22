import useTranslation from '~/hooks/useTranslation';
import styled from 'styled-components';
import React, { useState } from 'react';

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

  return (
    <Container>
      <Header>
        <Heading>Next Bus</Heading>
      </Header>
    </Container>
  );
};
export default React.memo(Home);
