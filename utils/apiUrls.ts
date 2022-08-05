export const API_HOST = 'https://data.etabus.gov.hk'

export const getAllStops =
  'https://search.kmb.hk/kmbwebsite/Function/FunctionRequest.ashx?action=getallstops'

export const getNearbyRoutes = `https://citymapper.com/api/2/nearby?brand_ids=KMBBus,LWBBus,RMBBus&limit=1&region_id=hk-hongkong&location=` // need coords value in location

export const getRoutesByLocationId = `https://citymapper.com/api/1/departures?headways=1&region_id=hk-hongkong&ids=`

export const API_ENDPOINTS = {
  routes: {
    list: '/v1/transport/kmb/route',
    route: '/v1/transport/kmb/route/{route}/{direction}/{service_type}', // /v1/transport/kmb/route/74B/outbound/1
  },
  stops: {
    list: '/v1/transport/kmb/stop',
    stop: '/v1/transport/kmb/stop/{stop_id}', // /v1/transport/kmb/stop/A3ADFCDF8487ADB9
  },
  routeStop: {
    list: '/v1/transport/kmb/route-stop',
    route: '/v1/transport/kmb/route-stop/{route}/{direction}/{service_type}', // /v1/transport/kmb/route-stop/1A/outbound/1
  },
  eta: {
    routeStop: '/v1/transport/kmb/eta/{stop_id}/{route}/{service_type}', // /v1/transport/kmb/eta/A60AE774B09A5E44/40/1
    stop: '/v1/transport/kmb/stop-eta/{stop_id}', // /v1/transport/kmb/stop-eta/B8B04CD1E568B8F6
    route: '/v1/transport/kmb/route-eta/{route}/{service_type}', // /v1/transport/kmb/route-eta/3M/1
  },
}
