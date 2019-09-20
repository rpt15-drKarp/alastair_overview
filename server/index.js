const express = require('express');
const bodyParser = require('body-parser');
const compression = require('compression');
const cors = require('cors');
const db = require('../db/index.js');
const port = 3000;

const app = express();

app.get('*.js', (req, res, next) => {
  req.url = req.url + '.gz';
  res.set('Content-Encoding', 'gzip');
  next();
});
app.use(cors());
app.use('/', express.static('public'));
app.use('/:gameId', express.static('public'));
app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get(`/api/overview/:gameId`, (req, res) => {
  console.log('got to overview get request in server');
  db.retrieve(req.params.gameId, (gameInfo) => {
    res.send(gameInfo);
  });
});

app.listen(port, () => {
  console.log(`App listening on ${port}`);
});