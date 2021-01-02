export const getAllStops = 'https://search.kmb.hk/kmbwebsite/Function/FunctionRequest.ashx?action=getallstops'

export const getNearbyRoutes = `https://citymapper.com/api/2/nearby?brand_ids=KMBBus,LWBBus,RMBBus&limit=1&region_id=hk-hongkong&location=` // need coords value in location

export const getRoutesByLocationId = `https://citymapper.com/api/1/departures?headways=1&region_id=hk-hongkong&ids=`