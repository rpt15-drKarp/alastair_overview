const db = require('./index.js');
const faker = require('faker');

// add fake data to database
const seedData = () => {
  for (let i = 0; i < 100; i++) {
    // create random number of tags
    let random = Math.floor(Math.random() * 10);
    let randomTags = [];

    for (let x = 0; x < random; x++) {
      randomTags.push(faker.random.word());
    }

    db.save({
      game_name: faker.random.word(),
      description: faker.lorem.paragraph(),
      release_date: faker.date.past().toISOString(),
      developer: faker.company.companyName(),
      publisher: faker.company.companyName(),
      tags: randomTags
    });
  }
};

seedData();