import React, { useState } from 'react';

import Etas from './etas';

const Stop = ({ stop, setRefresh = () => {}, refresh = false }) => {
  const [open, setOpen] = useState(false);
  const toggle = () => setOpen((prev) => !prev);

  return (
    <li>
      <div onClick={toggle}>{stop?.stop?.name}</div>
      {open && (
        <Etas setRefresh={setRefresh} refresh={refresh} stopping={stop} />
      )}
    </li>
  );
};
export default React.memo(Stop);
