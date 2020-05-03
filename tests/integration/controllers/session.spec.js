import request from 'supertest';
import crypto from 'crypto';

import app from '../../../src/app';
import connection from '../../../src/database/connection';
import factory from '../../utils/factory';

describe('Session', () => {
  beforeEach(async () => {
    await connection.migrate.rollback();
    await connection.migrate.latest();
  });

  afterAll(async () => {
    await connection.destroy();
  });

  it('should be able to logon', async () => {
    const ngo = await factory.attrs('Ngo');
    ngo.id = crypto.randomBytes(4).toString('HEX');

    await connection('ngos').insert(ngo);

    const response = await request(app)
      .post('/v1/sessions')
      .send({ id: ngo.id });

    expect(response.body).toStrictEqual({
      ngo: { name: ngo.name },
      token: expect.any(String),
    });
  });

  it('should not be able to logon with an ngo that not exists', async () => {
    const id = crypto.randomBytes(4).toString('HEX');

    const response = await request(app)
      .post('/v1/sessions')
      .expect(400)
      .send({ id });

    expect(response.body).toStrictEqual({
      statusCode: 400,
      error: 'Bad Request',
      message: 'Your NGO was not found',
      code: 240,
      docs: process.env.DOCS_URL,
    });
  });
});
