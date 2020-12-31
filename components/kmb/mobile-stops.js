import styled from 'styled-components';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { BottomSheet as SwipeableBottomSheet } from 'react-spring-bottom-sheet';
import 'react-spring-bottom-sheet/dist/style.css';

import Stop from './stop';
import Refresh from '~/components/refresh';
import useTranslation from '~/hooks/useTranslation';

const RefreshButton = styled.div`
  background-color: ${({ theme }) => theme.modalBackground};
  display: flex;
  align-items: center;
  justify-content: space-between;
  h4 {
    margin: 0 10px 0 0;
    text-align: left;
  }
`;

const BottomSheet = styled(SwipeableBottomSheet)`
  color: ${({ theme }) => theme.text};
  div[data-rsbs-overlay] {
    background-color: ${({ theme }) => theme.modalBackground};
  }
  [data-rsbs-overlay],
  [data-rsbs-backdrop],
  [data-rsbs-root]:after {
    z-index: 200;
  }
  [data-rsbs-header]:before {
    background-color: ${({ theme }) => theme.text};
  }
  [data-rsbs-root] {
    position: relative;
  }
`;

const ListContainer = styled.div`
  padding: 0 10px 0 10px;
  margin-bottom: 0;
`;

const List = styled.ol`
  overflow-y: auto;
  margin: 5px 0 0 0;
  li {
    margin: 5px 0;
    cursor: pointer;
    position: relative;
    .stop-detail {
      padding-right: 35px;
    }
    .eta-item {
      cursor: default;
    }
  }
`;

const Stops = ({
  loading = false,
  stops,
  showBottomSheet,
  setShowBottomSheet = () => {},
  routeDesc = null,
}) => {
  const { locale, t } = useTranslation();
  const [refresh, setRefresh] = useState(false);

  const onClickRefresh = useCallback(() => setRefresh(true), []);

  const dismissModel = useCallback(() => setShowBottomSheet(false), []);

  const renderSheetHeader = useCallback(() => {
    return (
      <RefreshButton>
        <h4>{routeDesc}</h4>
        <Refresh onClick={onClickRefresh} />
      </RefreshButton>
    );
  }, [routeDesc, onClickRefresh]);

  return (
    <BottomSheet
      header={renderSheetHeader()}
      open={showBottomSheet}
      onDismiss={dismissModel}
      snapPoints={({ maxHeight }) => maxHeight - 130}
    >
      <ListContainer>
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
        ) : (
          t('Loading...')
        )}
      </ListContainer>
    </BottomSheet>
  );
};

export default React.memo(Stops);
