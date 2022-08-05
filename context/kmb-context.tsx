import { getKmbRoutes } from '@services/kmb-service';
import { createContext, useEffect, useState } from 'react';

export const KmbContext = createContext({
  routes: [],
  setRoutes: (routes: []) => null,
});

export const KmbProvider = ({ children }) => {
  const [routes, setRoutes] = useState([]);

  useEffect(() => {
    const getKmbRoutesList = async () => {
      try {
        const busList = window.localStorage['KMB_ROUTES_LIST'] ? JSON.parse(window.localStorage['KMB_ROUTES_LIST']) : [];
        if (busList?.length) {
          setRoutes(busList);
          return;
        }
        const result = await getKmbRoutes();

        if (result) {
          window.localStorage.KMB_ROUTES_LIST = JSON.stringify(result);
          setRoutes(result);
        }
      } catch (err) {
        console.log(err);
      }
    };
    getKmbRoutesList();
  }, []);

  useEffect(() => {
    if (routes?.length && (routes !== JSON.parse(window.localStorage['KMB_ROUTES_LIST']))) {
      window.localStorage.KMB_ROUTES_LIST = JSON.stringify(routes);
      console.log('Updated storage');
      setRoutes(routes);
    }
  }, [routes]);

  return (
    <KmbContext.Provider value={{ routes, setRoutes }}>
      {children}
    </KmbContext.Provider>
  );
};
