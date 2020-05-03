import connection from '../../database/connection';
import paginationLinks from '../helpers/paginationLinks';

class NgoIncidentController {
  async index(req, res) {
    const { base_url, resource_url, ngo_id } = req;
    const { page = 1 } = req.query;
    const limit = 5;

    let incidents = await connection('incidents')
      .where('ngo_id', ngo_id)
      .limit(limit)
      .offset((page - 1) * limit)
      .select('*');

    incidents = incidents.map(({ id, title, description, value }) => ({
      id,
      title,
      description,
      value,
      url: `${base_url}/v1/incidents/${id}`,
      ngo: {
        id: ngo_id,
        url: `${base_url}/v1/ngos/${ngo_id}`,
      },
    }));

    const [count] = await connection('incidents')
      .where('ngo_id', ngo_id)
      .count();
    res.header('X-Total-Count', count['count(*)']);

    const pages_total = Math.ceil(count['count(*)'] / limit);
    if (pages_total > 1) {
      res.links(paginationLinks(page, pages_total, resource_url));
    }

    return res.json(incidents);
  }
}

export default new NgoIncidentController();
