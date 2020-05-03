import connection from '../../database/connection';
import paginationLinks from '../helpers/paginationLinks';
import hateoas from '../helpers/hateoas';

class NgoIncidentController {
  async index(req, res) {
    const { base_url, resource_url } = req;
    const { ngo_id } = req.params;
    const { page = 1 } = req.query;
    const limit = 5;

    const incidents = await connection('incidents')
      .where('ngo_id', ngo_id)
      .limit(limit)
      .offset((page - 1) * limit)
      .select('*')
      .then((data) => {
        return data.map(({ id, title, description, value }) => ({
          id,
          title,
          description,
          value,
          ngo: {
            id: ngo_id,
          },
        }));
      });

    const [count] = await connection('incidents')
      .where('ngo_id', ngo_id)
      .count();
    res.header('X-Total-Count', count['count(*)']);

    const pages_total = Math.ceil(count['count(*)'] / limit);
    if (pages_total > 1) {
      res.links(paginationLinks(page, pages_total, resource_url));
    }

    return res.json(
      hateoas(incidents, {
        url: `${base_url}/v1/incidents/:id`,
        ngo: { url: `${base_url}/v1/ngos/${ngo_id}` },
      })
    );
  }
}

export default new NgoIncidentController();
