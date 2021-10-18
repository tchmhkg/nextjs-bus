import axios from 'axios';

export default async function handler(req, res) {
  try {
    const apiRes = await axios.get('https://data.etabus.gov.hk/v1/transport/kmb/route/');
    if(apiRes?.data) {
      const routes = apiRes?.data?.data?.map(item => item.route);
      res.json({
        success: true,
        data: [...new Set(routes)]
      })
    }
    else {
      res.json({
        success: false,
        data: [],
      });
    }
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      data: [],
    });
  }
}