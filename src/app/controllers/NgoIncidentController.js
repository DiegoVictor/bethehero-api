import connection from '../../database/connection';
import paginationLinks from '../helpers/paginationLinks';

class NgoIncidentController {
  async index(req, res) {
    const { hostUrl, currentUrl } = req;
    const { ngo_id } = req.params;
    const { page = 1 } = req.query;
    const limit = 5;

    const incidents = await connection('incidents')
      .where('ngo_id', ngo_id)
      .limit(limit)
      .offset((page - 1) * limit)
      .select('*')
      .then((data) =>
        data.map((incident) => ({
          ...incident,
          ngo_url: `${hostUrl}/v1/ngos/${incident.ngo_id}`,
          url: `${hostUrl}/v1/incidents/${incident.id}`,
        }))
      );

    const [count] = await connection('incidents')
      .where('ngo_id', ngo_id)
      .count();
    res.header('X-Total-Count', count['count(*)']);

    const pagesTotal = Math.ceil(count['count(*)'] / limit);
    if (pagesTotal > 1) {
      res.links(paginationLinks(page, pagesTotal, currentUrl));
    }

    return res.json(incidents);
  }
}

export default NgoIncidentController;
