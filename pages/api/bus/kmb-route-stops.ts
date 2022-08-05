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
    const { route }: { route: Partial<IRoute> } = req.body

    const direction =
      route.bound === 'I' ? 'inbound' : route.bound === 'O' ? 'outbound' : null
    if (!direction) {
      res.json({
        success: false,
        stops: [],
      })
    }
    const url =
      API_HOST +
      API_ENDPOINTS.routeStop.route
        .replace('{route}', route.route)
        .replace('{direction}', direction)
        .replace('{service_type}', route.service_type)
    const apiRes = await axios.get(url)
    if (apiRes?.data) {
      const list = apiRes?.data?.data
      const stops = []

      for (let i = 0; i < list.length - 1; i++) {
        const busStopUrl = API_HOST + API_ENDPOINTS.stops.stop.replace('{stop_id}', list[i].stop)
        const stopApiRes = await axios.get(busStopUrl)

        const stopData = stopApiRes?.data?.data
        stops.push({seq: list[i].seq, ...stopData})
      }
      res.json({
        success: true,
        stops,
      })
    } else {
      res.json({
        success: false,
        stops: [],
      })
    }
  } catch (error) {
    console.log(error)
    res.json({
      success: false,
      stops: [],
    })
  }
}
