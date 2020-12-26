import React from 'react';

const Route = ({route, onClick = () => {}}) => {
  return (
    <li onClick={() => onClick(route)}>
        <div>{route?.getOriginDestinationString?.()}</div>
    </li>
  );
};
export default React.memo(Route);
