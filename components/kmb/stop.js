import React, { useState } from 'react';
import styled from 'styled-components';
import useTranslation from '~/hooks/useTranslation';
import Etas from './etas';

const Fare = styled.div`
  margin-left: 0px;
  font-size: 14px;
`;

const Stop = ({ stop, setRefresh = () => {}, refresh = false }) => {
  const [open, setOpen] = useState(false);
  const {t} = useTranslation();
  const toggle = () => setOpen((prev) => !prev);

  return (
    <li>
      <div onClick={toggle}>{stop?.stop?.name}{stop.fare > 0 && <Fare>{t('Fare')}: ${stop.fare}</Fare>}</div>
      {open && (
        <Etas setRefresh={setRefresh} refresh={refresh} stopping={stop} />
      )}
    </li>
  );
};
export default React.memo(Stop);
