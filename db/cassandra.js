
const cassandra = require('cassandra-driver')
const executeConcurrent = cassandra.concurrent.executeConcurrent

const client = new cassandra.Client({ 
  contactPoints: ['127.0.0.1'], 
  localDataCenter: 'datacenter1', 
  keyspace: 'overviews'
})

client.connect().then(() => console.log('Connected to Cassandra.'))

const queries = {
  saveOne: 'INSERT INTO overview (game_id, game) VALUES (?, ?)',
  countAll: 'SELECT (id, count) FROM summary',
  updateCount: 'INSERT INTO summary (id, count) VALUES (?, ?)',
  findOne: 'SELECT game FROM overview WHERE game_id = ?',
  deleteOne: 'DELETE FROM overview WHERE game_id = ?'
}

const save = (gameInfo) => {
  return client.execute(queries.saveOne, [gameInfo.game_id, gameInfo], { prepare: true }).then((ResultSet) => {
    return ResultSet.info
  })
}

const count = () => {
  //
}

const retrieve = (gameId) => {
  return Promise.resolve(client.execute(queries.findOne, [gameId], { prepare: true }).then(({ rows }) => {
    if (!rows.length) {
      throw `Game with id (${gameId}) is not in the database`
    }

    // wrap the result in an array for backwards compatibilty
    // with the inherited project's services
    return [rows[0].game]
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

const saveMultiple = (gameInfos) => {
  return executeConcurrent(client, queries.saveOne, gameInfos, { prepare: true })
}

module.exports = {
  save,
  retrieve,
  count,
  update,
  remove,
  saveMultiple
}