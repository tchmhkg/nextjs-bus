import Axios from 'axios';

export default async function handler(req, res) {
  try {
    const apiRes = await Axios.get('http://etadatafeed.kmb.hk:1933/GetData.ashx?type=ETA_R');

    res.json({
      success: true,
      data: apiRes?.data?.[0]?.r_no || [],
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      data: [],
    });
  }
}