const { Client } = require('pg')
const format = require('pg-format')

const client = new Client({
  user: 'postgres',
  host: 'localhost',
  database: 'overviews',
  password: 'something',
  port: 5432
})

client.connect()

const queries = {
  saveOne: 'INSERT INTO overviews(game_id, game_name, description, release_date, developer, publisher, tags) VALUES ($1, $2, $3, $4, $5, $6, $7)',
  countAll: 'SELECT COUNT(*) FROM overviews',
  findOne: 'SELECT * FROM overviews WHERE game_id = $1',
  deleteOne: 'DELETE FROM overviews WHERE game_id = $1',
  saveMultiple: 'INSERT INTO overviews(game_id, game_name, description, release_date, developer, publisher, tags) VALUES %L'
}
const save = (gameInfo) => {
 return client.query(queries.saveOne, Object.values(gameInfo))
}

const count = () => {
  return Promise.resolve(client.query(queries.countAll).then(({ rows }) => {
    if (rows.length) {
      return rows[0].count
    }
  }))
}

const retrieve = (gameId) => {
  return Promise.resolve(client.query(queries.findOne, [gameId]).then(({ rows }) => {
    if (rows.length) {
      return rows[0]
    }
  }))
}

const update = (gameId, gameInfo) => {
  let values = []
  let set = []
  Object.keys(gameInfo).forEach((key, index) => {
    values.push(gameInfo[key])
    set.push(` ${key}=($${index + 1})`)
  })
  values.push(gameId)

  let query = 'UPDATE overviews SET ' + set.join(',')
  query += ` WHERE game_id = $${set.length + 1}`

  return client.query(query, values)
}

const remove = (gameId) => {
  return client.query(queries.deleteOne, [gameId])
}

const begin = () => {
  return client.query('BEGIN')
}

const end = () => {
  return client.query('END')
}

const disableIndex = () => {
  return client.query(`UPDATE pg_index
    SET indisready=false
    WHERE indrelid = (
        SELECT oid
        FROM pg_class
        WHERE relname='overviews'
    )`)
}

const enableIndex = () => {
  return client.query(`UPDATE pg_index
    SET indisready=true
    WHERE indrelid = (
        SELECT oid
        FROM pg_class
        WHERE relname='overviews'
    )`).then(() => {
      return client.query('REINDEX TABLE overviews')
    })
}

const saveMultiple = (gameInfos) => {
  // pg-format doesn't take into consideration object fields which might
  // be arrays so we need to convert those to a postgres format here
  const values = gameInfos.map(
    (gameInfo) => Object.values(gameInfo).map(
      (val) => Array.isArray(val) ? `{${val.join(',')}}` : val))
  return client.query(format(queries.saveMultiple, values))
}

module.exports = {
  save,
  retrieve,
  count,
  update,
  remove,
  saveMultiple,
  begin,
  end,
  disableIndex,
  enableIndex
}