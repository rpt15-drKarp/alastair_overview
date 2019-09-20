const mongoose = require('mongoose');
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
  let game = new Overview(gameInfo);
  game.save((err) => {
    if (err) {
      console.log('error while saving to db', err);
    }
  });
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

module.exports.save = save;
module.exports.retrieve = retrieve;
module.exports.count = count;
