import 'dotenv/config';
import { faker } from '@faker-js/faker';

import bearerAuth from '../../../src/app/middlewares/bearerAuth';
import connection from '../../../src/database/connection';
import factory from '../../utils/factory';
import token from '../../utils/jwtoken';

describe('BearerAuth', () => {
  const res = {
    status: jest.fn(() => res),
    json: jest.fn(),
  };
  const next = jest.fn();

  beforeEach(async () => {
    await connection.migrate.rollback();
    await connection.migrate.latest();
  });

  afterAll(async () => {
    await connection.destroy();
  });

  it('should be authorizated', async () => {
    const ngo = await factory.attrs('Ngo');
    await connection('ngos').insert(ngo);

    const req = {
      headers: {
        authorization: `Bearer ${token(ngo.id)}`,
      },
    };
    await bearerAuth(req, res, next);

    expect(next).toHaveBeenCalled();
  });

  it('should not be authorizated without send a token', () => {
    const req = {
      headers: {},
    };

    bearerAuth(req, res, next).catch((err) => {
      expect({ ...err }).toStrictEqual({
        data: { code: 340 },
        isBoom: true,
        isServer: false,
        output: {
          statusCode: 400,
          payload: {
            statusCode: 400,
            error: 'Bad Request',
            message: 'Token not provided',
          },
          headers: {},
        },
      });
    });
  });

  it('should not be authorizated without send a valid token', async () => {
    const req = {
      headers: {
        authorization: faker.string.alphanumeric(32),
      },
    };

    bearerAuth(req, res, next).catch((err) => {
      const message = 'Token invalid';
      expect({ ...err }).toStrictEqual({
        data: null,
        isBoom: true,
        isServer: false,
        output: {
          statusCode: 401,
          payload: {
            statusCode: 401,
            error: 'Unauthorized',
            message,
            attributes: {
              code: 341,
              error: message,
            },
          },
          headers: {
            'WWW-Authenticate': `sample code="341", error="${message}"`,
          },
        },
      });
    });
  });
});
