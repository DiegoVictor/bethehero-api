import faker from 'faker';

import api, { setAuthorization } from '~/services/api';

describe('Api', () => {
  it('should be able to set a default header', () => {
    const token = faker.random.alphaNumeric(16);

    setAuthorization(token);

    expect(api.defaults.headers.common.Authorization).toBeDefined();
    expect(api.defaults.headers.common.Authorization).toBe(`Bearer ${token}`);
  });
});
