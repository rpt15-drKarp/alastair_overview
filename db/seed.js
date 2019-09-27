const db = require('./index.js');
const faker = require('faker');


// add fake data to database
const seedData = (numOfData) => {
  for (let i = 0; i < numOfData; i++) {
    // create random number of tags
    let random = Math.floor(Math.random() * 10);
    let randomTags = [];

    for (let x = 0; x < random; x++) {
      randomTags.push(faker.random.word());
    }
    if (i === numOfData - 1) {
      setTimeout(() => {
        process.exit();
      }, 1000)
    }
    // always make first object game_name Stardew_Valley
    if (i === 0) {
      db.save({
        game_id: i,
        game_name: 'Stardew_Valley',
        description: faker.lorem.paragraph(),
        release_date: faker.date.past().toISOString(),
        developer: faker.company.companyName(),
        publisher: faker.company.companyName(),
        tags: randomTags
      });
    } else {
      db.save({
        game_id: i,
        game_name: faker.random.word(),
        description: faker.lorem.paragraph(),
        release_date: faker.date.past().toISOString(),
        developer: faker.company.companyName(),
        publisher: faker.company.companyName(),
        tags: randomTags
      });
    }
  }
};

// only seed database if there are no current documents in database
db.count().then((results) => {
    if (results < 100) {
      seedData(100);
    } else {
      process.exit();
    }
});
