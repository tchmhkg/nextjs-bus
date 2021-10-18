import axios from 'axios';

export const getKmbRoutes = async () => {
  try {
    const apiRes = await axios.get('/api/bus/kmb-routes-list');
    if (apiRes?.data?.data?.length) {
      return apiRes?.data?.data;
    }
    return false;
  } catch (error) {
    console.error(error?.response?.data);
    return false;
  }
};
