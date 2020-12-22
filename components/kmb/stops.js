import styled from 'styled-components';
import React, { useState } from 'react';
import Stop from './stop';
import Refresh from '~/components/refresh';
import useTranslation from '~/hooks/useTranslation';

const SubHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  h5 {
    margin: 5px 0;
  }
`;

const List = styled.ol`
  height: 400px;
  overflow-y: auto;
  li {
    margin: 3px 0;
    cursor: pointer;
    .eta-item {
      cursor: default;
    }
  }
`;

const Stops = ({ stops }) => {
  const { locale } = useTranslation();
  const [refresh, setRefresh] = useState(false);

  const onClickRefresh = () => setRefresh(true);

  return (
    <div>
      <SubHeader>
        <h5>Bus stops</h5>
        <Refresh onClick={onClickRefresh} />
      </SubHeader>
      <List>
        {stops?.map((stop) => {
          return (
            <Stop
              key={`${stop?.stop?.id}_${stop?.sequence}_${locale}`}
              stop={stop}
              setRefresh={setRefresh}
              refresh={refresh}
            />
          );
        })}
      </List>
    </div>
  );
};
export default React.memo(Stops);
