import React from 'react';
import styled from 'styled-components';
import Route from '~/components/kmb/route';

const Container = styled.div`
  background-color: ${({theme})=>theme.cardBackground};
  padding: 15px;
  border-radius: 5px;
  box-shadow: 2px 2px 8px 0 rgba(0,0,0,0.2);
  margin: 20px 0;
  h5 {
    margin: 0 0 5px 0;
  }
  ol {
    margin: 0;
  }
`;

const Routes = ({ routes, onClickRoute = () => {} }) => {
  return (
    <Container>
      <h5>Routes</h5>
      <ol>
        {routes?.map((route) => (
          <Route
            key={`${route?.route?.number}_${route?.route?.bound}`}
            onClick={onClickRoute}
            route={route}
          />
        ))}
      </ol>
    </Container>
  );
};
export default React.memo(Routes);
