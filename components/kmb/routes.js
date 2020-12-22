import React from 'react';
import Route from '~/components/kmb/route';

const Routes = ({ routes, onClickRoute = () => {} }) => {
  return (
    <div>
      <h5>Routes</h5>
      <ol>
        {routes?.map((route) => (
          <Route
            key={`${route?.route?.number}_${route?.route?.bound}`}
            onClick={onClickRoute}
            route={route}
          />
        ))}
      </ol>
    </div>
  );
};
export default React.memo(Routes);
