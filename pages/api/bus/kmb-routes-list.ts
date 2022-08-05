import { IRoute } from '@store/slices/busSlice'
import { API_ENDPOINTS, API_HOST } from '@utils/apiUrls'
import axios from 'axios'
import _ from 'lodash'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const apiRes = await axios.get(API_HOST + API_ENDPOINTS.routes.list)
    if (apiRes?.data) {
      const groupedRoutes = _.groupBy(apiRes.data.data, 'route')
      const routeNumList = apiRes?.data?.data?.map((item: IRoute) => {
        return item.route
      })
      res.json({
        success: true,
        routeNumList: [...new Set(routeNumList)],
        routes: groupedRoutes//apiRes?.data?.data,
      })
    } else {
      res.json({
        success: false,
        routeNumList: [],
        routes: [],
      })
    }
  } catch (error) {
    console.log(error)
    res.json({
      success: false,
      routeNumList: [],
      routes: [],
    })
  }
}
