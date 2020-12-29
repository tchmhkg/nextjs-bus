import styled from 'styled-components';
import React, { useEffect, useMemo, useState } from 'react';
// import SwipeableBottomSheet from 'react-swipeable-bottom-sheet';
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
  ${'' /* .custom-bottom-sheet__body {
    background-color: ${({theme})=>theme.modalBackground};
    border-top-left-radius: 15px;
    border-top-right-radius: 15px;
  }, */}
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

const SheetHeader = styled.div`
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: ${({theme})=>theme.modalBackground};
    top: 0;
    position: absolute;
    width: 100%;
    padding: 15px 0 15px 0;
    border-top-left-radius: 15px;
    border-top-right-radius: 15px;
    .handle {
        width: 50px;
        height: 5px;
        border-radius: 5px;
        background-color: ${({theme})=>theme.text};
    }
`;

const ListContainer = styled.div`
    padding: 0 10px 0 10px;
    ${'' /* margin-top: 30px; */}
`;

const List = styled.ol`
  overflow-y: auto;
  li {
    margin: 5px 0;
    cursor: pointer;
    &:hover {
      background-color: ${({theme})=>theme.border};
    }
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
        // style={bottomSheetStyle}
        // bodyStyle={bottomSheetBodyStyle}
        // overflowHeight={0}
        open={showBottomSheet}
        onDismiss={dismissModel}
        snapPoints={({ minHeight }) => minHeight - 200}
        // onChange={setShowBottomSheet}
        // marginTop={200}
        // isFullScreen
        // containerClassName="bottom-sheet"
        // bodyClassName="bottom-sheet-body"
        // swipeableViewsProps={{hysteresis: false}}
    >
        {/* <SheetHeader><div className="handle" /></SheetHeader> */}
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
