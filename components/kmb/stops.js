import styled from 'styled-components';
import React, { useState } from 'react';
import Stop from './stop';
import Refresh from '~/components/refresh';
import useTranslation from '~/hooks/useTranslation';

const SubHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
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
      <ol>
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
      </ol>
    </div>
  );
};
export default React.memo(Stops);
