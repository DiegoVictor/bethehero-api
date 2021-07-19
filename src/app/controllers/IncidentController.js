import { notFound, unauthorized } from '@hapi/boom';

import connection from '../../database/connection';
import paginationLinks from '../helpers/paginationLinks';

class IncidentController {
  async index(req, res) {
    const { hostUrl, currentUrl } = req;
    const { page = 1 } = req.query;
    const limit = 5;

    const incidents = await connection('incidents')
      .join('ngos', 'ngos.id', '=', 'incidents.ngo_id')
      .limit(limit)
      .offset((page - 1) * limit)
      .select(['ngos.*', 'ngos.id as ngo_id', 'incidents.*'])
      .then((data) =>
        data.map((incident) => ({
          id: incident.id,
          title: incident.title,
          description: incident.description,
          value: incident.value,
          ngo: {
            id: incident.ngo_id,
            name: incident.name,
            email: incident.email,
            whatsapp: incident.whatsapp,
            city: incident.city,
            uf: incident.uf,
            url: `${hostUrl}/v1/ngos/${incident.ngo_id}`,
          },
          url: `${currentUrl}/${incident.id}`,
        }))
      );

    const [count] = await connection('incidents').count();
    res.header('X-Total-Count', count['count(*)']);

    const pagesTotal = Math.ceil(count['count(*)'] / limit);
    if (pagesTotal > 1) {
      res.links(paginationLinks(page, pagesTotal, currentUrl));
    }

    return res.json(incidents);
  }

  async show(req, res) {
    const { hostUrl, currentUrl } = req;
    const { id } = req.params;
    const incident = await connection('incidents').where('id', id).first();

    if (!incident) {
      throw notFound('Incident not found', { code: 144 });
    }

    return res.json({
      ...incident,
      ngo_url: `${hostUrl}/v1/ngos/${incident.ngo_id}`,
      url: currentUrl,
    });
  }

  async store(req, res) {
    const { title, description, value } = req.body;
    const { ngoId } = req;

    const [id] = await connection('incidents').insert({
      title,
      description,
      value,
      ngo_id: ngoId,
    });

    return res.json({ id });
  }

  async destroy(req, res) {
    const { id } = req.params;
    const { ngoId } = req;

    const incident = await connection('incidents')
      .where('id', id)
      .select('ngo_id')
      .first();

    if (!incident) {
      throw notFound('Incident not found', { code: 144 });
    }

    if (incident.ngo_id !== ngoId) {
      throw unauthorized('This incident is not owned by your NGO', 'sample', {
        code: 141,
      });
    }

    await connection('incidents').where('id', id).delete();

    return res.sendStatus(204);
  }
}

export default IncidentController;
