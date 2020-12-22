import React from 'react';

const Route = ({route, onClick = () => {}}) => {
  return (
    <li onClick={() => onClick(route)}>
        <div>{route.origin} {"\u2192"} {route.destination}</div>
    </li>
  );
};
export default React.memo(Route);
