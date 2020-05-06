import connection from '../../database/connection';
import paginationLinks from '../helpers/paginationLinks';

class NgoIncidentController {
  async index(req, res) {
    const { host_url, current_url } = req;
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
          ngo_url: `${host_url}/v1/ngos/${incident.ngo_id}`,
          url: `${host_url}/v1/incidents/${incident.id}`,
        }))
      );

    const [count] = await connection('incidents')
      .where('ngo_id', ngo_id)
      .count();
    res.header('X-Total-Count', count['count(*)']);

    const pages_total = Math.ceil(count['count(*)'] / limit);
    if (pages_total > 1) {
      res.links(paginationLinks(page, pages_total, current_url));
    }

    return res.json(incidents);
  }
}

export default new NgoIncidentController();
