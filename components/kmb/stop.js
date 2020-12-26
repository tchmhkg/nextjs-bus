import React, { useMemo, useState } from 'react';
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

  const fare = useMemo(() => `${t('Fare')}: $${stop.fare?.toFixed(1)}`, [stop?.fare, t]);

  return (
    <li>
      <div onClick={toggle}>{stop?.stop?.name}{stop.fare > 0 && <Fare>{fare}</Fare>}</div>
      {open && (
        <Etas setRefresh={setRefresh} refresh={refresh} stopping={stop} />
      )}
    </li>
  );
};
export default React.memo(Stop);
