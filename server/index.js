require('newrelic')
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
  db.retrieve(req.params.gameId).then((game) => {
    res.status(200)
    res.send(game)
  }).catch((error) => {
    /*
    * Idealy I would check the type of error and send a
    * useful message to client but the scope of this is
    * to scale the backend.
    */
    res.sendStatus(404)
    console.error(error)
  });
});

app.post('/api/overview/', (req, res) => {
  db.save(req.body).then((result) => {
    if (!result) {
      res.status(400);
      res.send('Malformed request');
    } else {
      res.status(201);
      res.set('Location', `/api/overview/${result.game_id}`);
      res.send("Successfuly created game overview.");
    }
  }).catch((err) => {
    res.status(500);
    res.send('Unable to save to database: ', err);
  })
});

app.put(`/api/overview/:gameId`, (req, res) => {
  db.update(req.params.gameId, req.body).then((results) => {
    res.sendStatus(200)
  }).catch((err) => {
    console.error(err)
    res.sendStatus(500)
  })
});

app.delete(`/api/overview/:gameId`, (req, res) => {
  db.remove(req.params.gameId).then((results) => {
    if (!results) {
      res.sendStatus(404)
    } else {
      res.sendStatus(200)
    }
  }).catch((err) => {
    console.error(err)
    res.sendStatus(500)
  })
});


app.listen(port, () => {
  console.log(`App listening on ${port}`);
});
