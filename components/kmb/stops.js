import styled from 'styled-components';
import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import Refresh from '~/components/refresh';
import useTranslation from '~/hooks/useTranslation';
const Stop = dynamic(import('~/components/kmb/stop'));

const Container = styled.div`
  background-color: ${({theme})=>theme.cardBackground};
  padding: 15px;
  border-radius: 5px;
  box-shadow: 2px 2px 8px 0 rgba(0,0,0,0.2);
  margin: 20px 0;
  ol {
    margin: 0;
  }
`;

const SubHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  h5 {
    margin: 5px 0;
  }
`;

const List = styled.ol`
  max-height: 400px;
  overflow-y: auto;
  li {
    margin: 5px 0;
    cursor: pointer;
    position: relative;
    &:hover {
      background-color: ${({theme})=>theme.backgroundAlt};
    }
    .eta-item {
      cursor: default;
    }
  }
`;

const Stops = ({ loading = false, stops }) => {
  const { locale, t } = useTranslation();
  const [refresh, setRefresh] = useState(false);

  const onClickRefresh = () => setRefresh(true);

  return (
    <Container>
      <SubHeader>
        <h5>{t('Bus stops')}</h5>
        <Refresh onClick={onClickRefresh} />
      </SubHeader>
      {!loading ? (
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
      ) : t('Loading...') }
    </Container>
  );
};
export default React.memo(Stops);
