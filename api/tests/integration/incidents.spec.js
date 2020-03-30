import request from 'supertest';

import app from '../../src/app';
import connection from '../../src/database/connection';
import factory from '../utils/factory';
import token from '../utils/jwtoken';

describe('Incident', () => {
  let ong;
  let authorization;

  beforeEach(async () => {
    await connection.migrate.rollback();
    await connection.migrate.latest();

    ong = await factory.attrs('Ong');
    await connection('ongs').insert(ong);

    authorization = `Bearer ${token(ong.id)}`;
  });

  afterAll(async () => {
    await connection.destroy();
  });

  it('should be able to get a page of incidents', async () => {
    const incidents = await factory.attrsMany('Incident', 5, {
      ong_id: ong.id,
    });
    await connection('incidents').insert(incidents);

    const response = await request(app).get('/incidents').send();

    incidents.forEach((incident) => {
      expect(response.body).toContainEqual(expect.objectContaining(incident));
    });
  });

  it('should be able to create a new incident', async () => {
    const { title, description, value } = await factory.attrs('Incident');
    const response = await request(app)
      .post('/incidents')
      .set('Authorization', authorization)
      .send({ title, description, value });

    expect(response.body).toHaveProperty('id');
  });

  it('should be able to delete an incident', async () => {
    const incident = await factory.attrs('Incident', { ong_id: ong.id });
    await connection('incidents').insert(incident);

    await request(app)
      .delete(`/incidents/${incident.id}`)
      .set('Authorization', authorization)
      .expect(204)
      .send();
  });

  it('should not be able to delete an incident that not exists', async () => {
    const { id } = await factory.attrs('Incident', { ong_id: ong.id });

    const response = await request(app)
      .delete(`/incidents/${id}`)
      .set('Authorization', authorization)
      .expect(404)
      .send();

    expect(response.body).toStrictEqual({
      error: {
        message: 'Incident not found',
      },
    });
  });

  it('should not be able to delete an incident from another ONG', async () => {
    const incident = await factory.attrs('Incident');
    await connection('incidents').insert({ ...incident, ong_id: ong.id });

    const response = await request(app)
      .delete(`/incidents/${incident.id}`)
      .set('Authorization', `Bearer ${token(incident.ong_id)}`)
      .expect(401)
      .send();

    expect(response.body).toStrictEqual({
      error: {
        message: 'This incident is not owned by your ONG',
      },
    });
  });
});
