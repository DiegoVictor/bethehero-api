import { notFound } from '@hapi/boom';

import connection from '../../database/connection';
import generateUniqueId from '../../utils/generateUniqueId';
import paginationLinks from '../helpers/paginationLinks';

class NgoController {
  async index(req, res) {
    const { currentUrl } = req;
    const { page = 1 } = req.query;
    const limit = 5;
    const ngos = await connection('ngos')
      .limit(limit)
      .offset((page - 1) * limit)
      .select('*')
      .then((data) =>
        data.map((ngo) => ({
          ...ngo,
          incidents_url: `${currentUrl}/${ngo.id}/incidents`,
          url: `${currentUrl}/${ngo.id}`,
        }))
      );

    const [count] = await connection('ngos').count();
    res.header('X-Total-Count', count['count(*)']);

    const pagesTotal = Math.ceil(count['count(*)'] / limit);
    if (pagesTotal > 1) {
      res.links(paginationLinks(page, pagesTotal, currentUrl));
    }

    return res.json(ngos);
  }

  async show(req, res) {
    const { currentUrl } = req;
    const { id } = req.params;
    const ngo = await connection('ngos').where('id', id).first();

    if (!ngo) {
      throw notFound('NGO not found', { code: 244 });
    }

    return res.json({
      ...ngo,
      incidents_url: `${currentUrl}/incidents`,
      url: currentUrl,
    });
  }

  async store(req, res) {
    const { name, email, whatsapp, city, uf } = req.body;
    const id = generateUniqueId();

    await connection('ngos').insert({ id, name, email, whatsapp, city, uf });

    return res.json({ id });
  }
}

export default new NgoController();
