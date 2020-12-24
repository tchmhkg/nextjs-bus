import styled from 'styled-components';
import React, { useMemo, useState } from 'react';
import SwipeableBottomSheet from 'react-swipeable-bottom-sheet';

import Stop from './stop';
import Refresh from '~/components/refresh';
import useTranslation from '~/hooks/useTranslation';
import { useTheme } from '~/theme';

const SubHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  h5 {
    margin: 5px 0;
  }
`;

const BottomSheet = styled(SwipeableBottomSheet)``;

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
    padding: 10px 10px 0 10px;
    top: 30px;
`;

const List = styled.ol`
  ${'' /* height: 400px; */}
  overflow-y: auto;
  li {
    margin: 3px 0;
    cursor: pointer;
    &:hover {
      background-color: ${({theme})=>theme.border};
    }
    .eta-item {
      cursor: default;
    }
  }
`;

const Stops = ({ stops, showBottomSheet, setShowBottomSheet = () => {} }) => {
  const { locale } = useTranslation();
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

  const toggleBottomSheet = () => {
      setShowBottomSheet(prev => !prev);
  }
  return (
    <BottomSheet
        style={bottomSheetStyle}
        bodyStyle={bottomSheetBodyStyle}
        overflowHeight={0}
        open={showBottomSheet}
        onChange={setShowBottomSheet}
        marginTop={180}
        fullScreen
    >
        <SheetHeader><div className="handle" /></SheetHeader>
        <ListContainer>
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
        </ListContainer>
    </BottomSheet>
  )
//   return (
//     <div>
//       <SubHeader>
//         <h5>Bus stops</h5>
//         <Refresh onClick={onClickRefresh} />
//       </SubHeader>
//       <List>
//         {stops?.map((stop) => {
//           return (
//             <Stop
//               key={`${stop?.stop?.id}_${stop?.sequence}_${locale}`}
//               stop={stop}
//               setRefresh={setRefresh}
//               refresh={refresh}
//             />
//           );
//         })}
//       </List>
//     </div>
//   );
};
export default React.memo(Stops);
