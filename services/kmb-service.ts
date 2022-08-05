import { IRoute } from '@store/slices/busSlice'
import axios from 'axios'

export const getKmbRoutes = async () => {
  try {
    const apiRes = await axios.get('/api/bus/kmb-routes-list')
    console.log("🚀 ~ file: kmb-service.ts ~ line 6 ~ getKmbRoutes ~ apiRes", apiRes)
    if (apiRes?.data?.success) {
      return apiRes?.data
    }
    return false
  } catch (error) {
    console.error(error?.response?.data)
    return false
  }
}

export const getStops = async (route: Partial<IRoute>) => {
  try {
    const apiRes = await axios.post('/api/bus/kmb-route-stops', { route})
    if (apiRes?.data) {
      return apiRes?.data?.stops
    }
    return false
  } catch (error) {
    console.error(error?.response?.data)
    return false
  }
}
