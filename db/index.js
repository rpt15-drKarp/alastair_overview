const { db } = require('../config.js');

if (db === 'cassandra') {
  const cassandra = require('./cassandra.js')
  module.exports = cassandra;
  module.exports.name = 'cassandra'
} else if (db === 'postgres') {
  const postgres = require('./postgres.js')
  module.exports = postgres;
  module.exports.name = 'postgres'
} else {
  console.error(`No configuration found for database: ${db}`);
  process.exit(1);
}
