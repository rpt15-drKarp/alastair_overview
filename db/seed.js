const db = require('./index.js');
const faker = require('faker');
const Promise = require('bluebird')


// add fake data to database
async function seedData (numOfData) {
  // create random number of tags
  const randomTags = () => {
    let random = Math.floor(Math.random() * 10);
    let randomTags = [];

    for (let x = 0; x < random; x++) {
      randomTags.push(faker.random.word());
    }

    return randomTags;
  }

  const makeOverview = (i) => {
    return {
      game_id: i,
      game_name: i === 1 ? 'Stardew_Valley' : faker.random.word(),
      description: faker.lorem.paragraph(),
      release_date: faker.date.past().toISOString(),
      developer: faker.company.companyName(),
      publisher: faker.company.companyName(),
      tags: randomTags()
    }
  }

  if (db.name === 'cassandra') {
    const concurrency = 10000
    for (let i = 0; i < numOfData; i += concurrency) {
      let gameInfos = Array.from(new Array(concurrency).keys()).map((x) => [i + x, makeOverview(i + x)])
      await db.saveMultiple(gameInfos)
    }
  } else {
    await db.begin()
    await db.disableIndex()

    const concurrency = 1000
    for (let i = 0; i < numOfData; i += concurrency) {
      let gameInfos = Array.from(new Array(concurrency).keys()).map((x) => makeOverview(i + x))
      await db.saveMultiple(gameInfos)
    }

    await db.enableIndex()
    await db.end()
  }

};

// only seed database if there are no current documents in database
db.count().then((results) => {
    if (results.toString() == 0) {
      const start = Date.now();
      seedData(10000000).then(() => {
        console.log(`Took ${((Date.now() - start) / 1000) / 60} minutes to seed database.`);
        process.exit();
      }).catch((error) => {
        console.error(error);
        process.exit(1);
      });
      
    } else {
      process.exit();
    }
});
