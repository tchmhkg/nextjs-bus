import Route from '@components/kmb/route';
import useTranslation from '@hooks/useTranslation';
import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  background-color: ${({ theme }) => theme.cardBackground};
  padding: 15px;
  border-radius: 5px;
  box-shadow: 2px 2px 8px 0 rgba(0,0,0,0.2);
  margin: 20px 0;
  h5 {
    margin: 0 0 5px 0;
  }
  span {
    font-size: 12px;
  }
`;

const Routes = ({ loading = false, routes, onClickRoute = (route: any) => { } }) => {
  const { t } = useTranslation();
  // console.log(routes);
  return (
    <Container>
      <h5>{t('Routes')}</h5>
      {!loading ? (
        routes?.map((route) => (
          <Route
            key={`${route?.route?.number}_${route?.route?.bound}`}
            onClick={onClickRoute}
            route={route}
          />
        ))
      ) : t('Loading...')}
    </Container>
  );
};
export default React.memo(Routes);
