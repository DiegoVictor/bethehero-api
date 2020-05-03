import { notFound } from '@hapi/boom';

import connection from '../../database/connection';
import generateUniqueId from '../../utils/generateUniqueId';
import paginationLinks from '../helpers/paginationLinks';
import hateoas from '../helpers/hateoas';

class NgoController {
  async index(req, res) {
    const { base_url, resource_url } = req;
    const { page = 1 } = req.query;
    const limit = 5;
    const ngos = await connection('ngos')
      .limit(limit)
      .offset((page - 1) * limit)
      .select('*');

    const [count] = await connection('ngos').count();
    res.header('X-Total-Count', count['count(*)']);

    const pages_total = Math.ceil(count['count(*)'] / limit);
    if (pages_total > 1) {
      res.links(paginationLinks(page, pages_total, resource_url));
    }

    return res.json(
      hateoas(ngos, {
        url: `${resource_url}/:id`,
        incidents_url: `${base_url}/v1/ngos/:id/incidents`,
      })
    );
  }

  async show(req, res) {
    const { base_url, resource_url } = req;
    const { id } = req.params;
    const ngo = await connection('ngos').where('id', id).first();

    if (!ngo) {
      throw notFound('NGO not found', { code: 244 });
    }

    return res.json(
      hateoas(ngo, {
        url: resource_url,
        incidents_url: `${base_url}/v1/ngos/:id/incidents`,
      })
    );
  }

  async store(req, res) {
    const { name, email, whatsapp, city, uf } = req.body;
    const id = generateUniqueId();

    await connection('ngos').insert({ id, name, email, whatsapp, city, uf });

    return res.json({ id });
  }
}

export default new NgoController();
