import RateLimit from '../../../src/app/middlewares/RateLimit';

describe('RateLimit', () => {
  const res = {
    status: jest.fn(() => res),
    json: jest.fn(),
  };
  const next = jest.fn();

  it('should be able to consume the api', async () => {
    await RateLimit({}, res, next);
    expect(next).toHaveBeenCalled();
  });

  it('should not be able to consume after many requests', async () => {
    const requests = [];

    for (let i = 0; i < 10; i += 1) {
      requests.push(RateLimit({}, res, next));
    }

    Promise.all(requests).catch((err) => {
      expect({ ...err }).toStrictEqual({
        data: { code: 449 },
        isBoom: true,
        isServer: false,
        output: {
          statusCode: 429,
          payload: {
            statusCode: 429,
            error: 'Too Many Requests',
            message: 'Too Many Requests',
          },
          headers: {},
        },
      });
    });
  });
});
