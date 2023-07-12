import factory from 'factory-girl';
import { faker } from '@faker-js/faker';

factory.define(
  'Ngo',
  {},
  {
    id: () => faker.string.alphanumeric(8),
    name: faker.person.fullName,
    email: faker.internet.email,
    whatsapp: () => faker.phone.number('###########'),
    city: faker.location.city,
    uf: () => faker.location.state({ abbreviated: true }),
  }
);

factory.define(
  'Incident',
  {},
  {
    id: faker.number.int,
    title: faker.lorem.words,
    description: faker.lorem.paragraph,
    value: () => Number(faker.finance.amount()),
    ngo_id: () => faker.string.alphanumeric(8),
  }
);

export default factory;
