import request from 'supertest';
import crypto from 'crypto';

import app from '../../../src/app';
import connection from '../../../src/database/connection';
import factory from '../../utils/factory';

describe("NGO's Incidents", () => {
  const url = `http://127.0.0.1:${process.env.APP_PORT}/v1`;

  beforeEach(async () => {
    await connection.migrate.rollback();
    await connection.migrate.latest();
  });

  afterAll(async () => {
    await connection.destroy();
  });

  it("should be able to get NGO's incidents", async () => {
    const ngo = await factory.attrs('Ngo', {
      id: crypto.randomBytes(4).toString('HEX'),
    });

    await connection('ngos').insert(ngo);

    let incidents = await factory.attrsMany('Incident', 10, {
      ngo_id: ngo.id,
    });
    incidents = incidents.map((incident, index) => ({
      ...incident,
      id: index + 1,
    }));
    await connection('incidents').insert(incidents);

    const response = await request(app)
      .get(`/v1/ngos/${ngo.id}/incidents`)
      .send();

    incidents.slice(0, 5).forEach(({ id, title, description, value }) => {
      expect(response.body).toContainEqual({
        id,
        description,
        title,
        value,
        ngo_id: ngo.id,
        ngo_url: `${url}/ngos/${ngo.id}`,
        url: `${url}/incidents/${id}`,
      });
    });
  });
});
