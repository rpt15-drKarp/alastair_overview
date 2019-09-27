/*const mongoose = require('mongoose');
const { devDb, prodDb, nodeEnv } = require('../config.js');

console.log('devDb, prodDb, nodeEnv', devDb, prodDb, nodeEnv);


if (nodeEnv === 'development') {
  mongoose.connect(`mongodb://localhost:27017/overview`, { useNewUrlParser: true });
} else {
  mongoose.connect(`mongodb://localhost:27017/overview`, { useNewUrlParser: true });
}

let db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error'));
db.once('open', () => {
  console.log('connected to mongoDB');
});

const OverviewSchema = new mongoose.Schema({
  game_id: Number,
  game_name: String,
  description: String,
  release_date: String,
  developer: String,
  publisher: String,
  tags: Array
});

const Overview = mongoose.model('Overview', OverviewSchema);

const save = (gameInfo) => {
  // let game = new Overview(gameInfo);
  // game.save((err) => {
  //   if (err) {
  //     console.log('error while saving to db', err);
  //   }
  // });

  return new Overview(gameInfo).save()
};

const retrieve = (gameId, sendToClient) => {
  Overview.find({ game_id: gameId})
    .exec((err, results) => {
      if (err) {
        console.log('error while retrieving data from db');
        sendToClient('The game is not in our database')
      } else {
      // console.log('results in mongo retrieve', results);
      sendToClient(results);
      }
    });
}

const count = (log) => {
  Overview.countDocuments({})
    .exec((err, results) => {
      if (err) {
        console.log('error while getting count of documents in db');
      } else {
        log(results);
      }
    })
};

const update = (gameInfo) => {
  return Overview.findOneAndUpdate({ game_id: gameInfo.game_id }, gameInfo)
}

const remove = (gameId) => {
  return Overview.findOneAndDelete({ game_id: gameId })
}*/

const cassandra = require('cassandra-driver')
const client = new cassandra.Client({ contactPoints: ['127.0.0.1'], localDataCenter: 'datacenter1', keyspace: 'overviews' })

client.connect().then(() => console.log('Connected to Cassandra.'))

const queries = {
  saveOne: 'INSERT INTO overview (game_id, game) VALUES (?, ?)',
  countAll: 'SELECT COUNT(*) FROM overview',
  findOne: 'SELECT game FROM overview WHERE game_id = ?',
  deleteOne: 'DELETE FROM overview WHERE game_id = ?'
}

const testGame = {
  game_id: 2,
  game_name: 'Stardew_Valley',
  description: 'faker.lorem.paragraph()',
  release_date: 'faker.date.past().toISOString()',
  //developer: 'faker.company.companyName()',
  publisher: 'faker.company.companyName()',
  tags: ['tag1', 'tag2', 'tag3']
}

const save = (gameInfo) => {
  return Promise.resolve(client.execute(queries.saveOne, [gameInfo.game_id, gameInfo], { prepare: true }).then((ResultSet) => {
    return ResultSet.info
  }))
}

const count = () => {
  return Promise.resolve(client.execute(queries.countAll).then((ResultSet) => {
    return ResultSet.rows[0].count
  }))
}

const retrieve = (gameId) => {
  return Promise.resolve(client.execute(queries.findOne, [gameId], { prepare: true }).then((ResultSet) => {
    if (!ResultSet.rows.length) {
      throw `Game with id (${gameId}) is not in the database`
    }

    // wrap the result in an array for backwards compatibilty
    // with the inherited project's services
    return [ResultSet.rows[0].game]
  }))
}

const update = (gameId, gameInfo) => {
  // In Cassandra, an insert automatically upserts which means
  // it will update the row if it already exists. It means
  // that a PUT request is the same as POST request for how
  // I have implemented this.
  gameInfo.game_id = gameId
  return save(gameInfo)
}

const remove = (gameId) => {
  return Promise.resolve(client.execute(queries.deleteOne, [gameId], { prepare: true }).then((ResultSet) => {
    return ResultSet.info
  }))
}

module.exports.save = save;
module.exports.retrieve = retrieve;
module.exports.count = count;
module.exports.update = update;
module.exports.remove = remove;
