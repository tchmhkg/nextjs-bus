import React, { useCallback, useMemo, useState } from 'react';
import { BottomSheet as SwipeableBottomSheet } from 'react-spring-bottom-sheet';
import 'react-spring-bottom-sheet/dist/style.css';
import styled from 'styled-components';

import Refresh from '@components/refresh';
import useTranslation from '@hooks/useTranslation';
import { getBusState } from '@store/slices/busSlice';
import { getStringByLocale } from '@utils/index';
import { useSelector } from 'react-redux';
import Stop from './stop';

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
  showBottomSheet,
  setShowBottomSheet = (show: boolean) => { },
}) => {
  const { locale, t } = useTranslation();
  const [refresh, setRefresh] = useState(false);
  const { stops, routeDirection } = useSelector(getBusState)

  const routeDesc = useMemo(() => {
    return `${getStringByLocale(routeDirection, 'orig', locale)} ${String.fromCodePoint(0x2192)} ${getStringByLocale(routeDirection, 'dest', locale)}`
  }, [locale, routeDirection])

  const onClickRefresh = useCallback(() => setRefresh(true), []);

  const dismissModel = useCallback(() => setShowBottomSheet(false), [setShowBottomSheet]);

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
                  key={`${stop?.stop}_${stop?.seq}_${locale}`}
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
