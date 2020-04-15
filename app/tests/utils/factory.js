import factory from 'factory-girl';
import faker from 'faker';

factory.define(
  'Incident',
  {},
  {
    id: faker.random.number,
    title: faker.name.title,
    description: faker.lorem.paragraph,
    ngo: {
      name: faker.name.findName,
      email: faker.internet.email,
      whatsapp: () => faker.phone.phoneNumber('###########'),
      city: faker.address.city,
      uf: faker.address.stateAbbr,
    },
    value: faker.finance.amount,
  }
);

export default factory;
