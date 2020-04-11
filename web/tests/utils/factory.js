import faker from 'faker';
import factory from 'factory-girl';

factory.define(
  'Ngo',
  {},
  {
    id: faker.random.number,
    name: faker.name.findName,
    email: faker.internet.email,
    whatsapp: () => faker.phone.phoneNumber('###########'),
    city: faker.address.city,
    state: faker.address.stateAbbr,
  }
);

factory.define(
  'Incident',
  {},
  {
    id: faker.random.number,
    title: faker.name.title,
    description: faker.lorem.paragraph,
    value: () => Number(faker.finance.amount()),
  }
);

export default factory;
