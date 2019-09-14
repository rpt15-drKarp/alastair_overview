const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const compression = require('compression');
const db = require('../db/index.js');
// const dotenv = require('dotenv');
const port = 3000;

const app = express();

// dotenv.config();

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

app.get('/api/image/:gameId', (req, res) => {
  // make request to Bryan's server
  axios.get('http://ec2-13-57-33-155.us-west-1.compute.amazonaws.com:3002/1/stardew_valley/api/image/1/stardew_valley')
  .then((response) => {
    // console.log('response.data from get request to Bryan', response.data);
    res.send(response.data);
  })
  .catch((error) => {
    console.log('error in get request to Bryan database', error);
  });
});

app.get('/api/reviews/:gameId', (req, res) => {
  // make request to Therese's server
  console.log('got to reviews get request in server');
  axios.get('http://ec2-54-67-60-167.us-west-1.compute.amazonaws.com/api/reviews/:gameId')
    .then((response) => {
      // console.log('response.data from get request to Therese', response.data);
      res.send(response.data);
    })
    .catch((error) => {
      console.log('error in get request to Therese database', error);
    });
});


app.listen(port, () => {
  console.log(`App listening on ${port}`);
});