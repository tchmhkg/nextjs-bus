import { IRoute } from '@store/slices/busSlice'
import { API_ENDPOINTS, API_HOST } from '@utils/apiUrls'
import axios from 'axios'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const apiRes = await axios.get(API_HOST + API_ENDPOINTS.routes.list)
    if (apiRes?.data) {
      const routeNumList = apiRes?.data?.data?.map((item: IRoute) => item.route)
      res.json({
        success: true,
        routeNumList: [...new Set(routeNumList)],
        routes: apiRes?.data?.data,
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
