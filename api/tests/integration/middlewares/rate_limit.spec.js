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

    let response;
    for (let i = 0; i < 10; i += 1) {
      requests.push(RateLimit({}, res, next));
    }

    try {
      await Promise.all(requests);
    } catch (err) {
      response = err;
    }

    expect(response).toStrictEqual(
      tooManyRequests('Too Many Requests', { code: 449 })
    );
  });
});
