import styled from 'styled-components';
import React, { useEffect, useMemo, useState } from 'react';
import { BottomSheet as SwipeableBottomSheet } from 'react-spring-bottom-sheet'
import 'react-spring-bottom-sheet/dist/style.css'

import Stop from './stop';
import Refresh from '~/components/refresh';
import useTranslation from '~/hooks/useTranslation';
import { useTheme } from '~/theme';

const RefreshButton = styled.div`
  position: absolute;
  right: 0;
  top: 15px;
  background-color: ${({theme})=>theme.modalBackground};
  width: 100%;
  display: flex;
  justify-content: flex-end;
  padding: 0 15px 5px 15px;
`;

const BottomSheet = styled(SwipeableBottomSheet)`
  color: ${({theme})=>theme.text};
  div[data-rsbs-overlay] {
    background-color: ${({theme})=>theme.modalBackground};
  }
  [data-rsbs-overlay], [data-rsbs-backdrop], [data-rsbs-root]:after {
    z-index: 200;
  }
  [data-rsbs-header]:before {
    background-color: ${({theme})=>theme.text};
  }
`;

const ListContainer = styled.div`
    padding: 0 10px 0 10px;
`;

const List = styled.ol`
  overflow-y: auto;
  li {
    margin: 5px 0;
    cursor: pointer;
    ${'' /* &:hover {
      opacity: 0.9;
    } */}
    .eta-item {
      cursor: default;
    }
  }
`;

const Stops = ({ loading = false, stops, showBottomSheet, setShowBottomSheet = () => {} }) => {
  const { locale, t } = useTranslation();
  const { colors } = useTheme();
  const [refresh, setRefresh] = useState(false);
  const bottomSheetStyle = useMemo(() => ({
      zIndex: 200,
  }), [colors]);
  const bottomSheetBodyStyle = useMemo(() => ({
    backgroundColor: colors.modalBackground,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15
}), [colors]);

  const onClickRefresh = () => setRefresh(true);

  useEffect(() => {
    if(showBottomSheet) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.removeProperty('overflow');
    }
  }, [showBottomSheet])

  const dismissModel = () => setShowBottomSheet(false);

  return (
    <BottomSheet
        open={showBottomSheet}
        onDismiss={dismissModel}
        snapPoints={({ maxHeight }) => maxHeight - 200}
    >
        <RefreshButton><Refresh onClick={onClickRefresh} /></RefreshButton>
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
        ): t('Loading...') }
        </ListContainer>
    </BottomSheet>
  )
};

export default React.memo(Stops);
