import factory from 'factory-girl';
import { faker } from '@faker-js/faker';

factory.define(
  'Ngo',
  {},
  {
    id: () => faker.random.alphaNumeric(8),
    name: faker.name.fullName,
    email: faker.internet.email,
    whatsapp: () => faker.phone.number('###########'),
    city: faker.address.city,
    uf: faker.address.stateAbbr,
  }
);

factory.define(
  'Incident',
  {},
  {
    id: faker.datatype.number,
    title: faker.lorem.words,
    description: faker.lorem.paragraph,
    value: () => Number(faker.finance.amount()),
    ngo_id: () => faker.random.alphaNumeric(8),
  }
);

export default factory;
