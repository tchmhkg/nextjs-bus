import React from 'react';
import Etas from './etas';

const Stop = ({ stop, setRefresh = () => {}, refresh = false }) => {
  return (
    <li>
      {stop?.stop?.name}{' '}
      <Etas setRefresh={setRefresh} refresh={refresh} stopping={stop} />
    </li>
  );
};
export default React.memo(Stop);
