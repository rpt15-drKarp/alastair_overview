/*const mongoose = require('mongoose');*/
const { db } = require('../config.js');

if (db === 'cassandra') {
  const cassandra = require('./cassandra.js')
  module.exports = cassandra;
} else {
  // postgres
}
