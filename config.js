const dotenv = require('dotenv');
dotenv.config();

module.exports = {
  db: process.env.DB,
  devEndpoint: process.env.DEV_API_URL,
  prodEndpoint: process.env.PROD_API_URL,
  devDb: process.env.DEV_DB_HOST,
  prodDb: process.env.PROD_DB_HOST,
  nodeEnv: process.env.NODE_ENV
};