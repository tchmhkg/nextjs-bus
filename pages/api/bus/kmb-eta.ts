import { IRoute } from '@store/slices/busSlice'
import { API_ENDPOINTS, API_HOST } from '@utils/apiUrls'
import axios from 'axios'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method !== 'POST') {
      res.status(405).send({ message: 'Only POST requests allowed' })
      return
    }
    const { route, stopId }: { route: Partial<IRoute>; stopId: string } =
      req.body

    const url =
      API_HOST +
      API_ENDPOINTS.eta.routeStop
        .replace('{route}', route.route)
        .replace('{stop_id}', stopId)
        .replace('{service_type}', route.service_type)
    const apiRes = await axios.get(url)
    if (apiRes?.data) {
      res.json({
        success: true,
        etas: apiRes?.data,
      })
    } else {
      res.json({
        success: false,
        etas: [],
      })
    }
  } catch (error) {
    console.log(error)
    res.json({
      success: false,
      etas: [],
    })
  }
}
