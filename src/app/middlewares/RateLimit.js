import { tooManyRequests } from '@hapi/boom';

import { RateLimiter } from '../../database/redis';
import config from '../../config/rate_limit';

const rate_limiter = new RateLimiter(config);

export default async (req, _, next) => {
  try {
    await rate_limiter.consume(req.ip);
    return next();
  } catch (err) {
    throw tooManyRequests('Too Many Requests', { code: 449 });
  }
};
