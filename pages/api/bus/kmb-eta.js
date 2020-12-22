import Kmb from 'js-kmb-api';

const kmb = new Kmb();

export default async function handler(req, res) {
  const {stopping, lang = 'en'} = req.query;

  try {
    const stoppingJson = JSON.parse(stopping);
    stoppingJson.__proto__ = kmb.Stopping.prototype;

    const etas = await stoppingJson.getEtas();

    res.json({
      success: true,
      data: etas || [],
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      data: [],
    });
  }
}