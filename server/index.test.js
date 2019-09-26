import React from 'react';
// const { shallow, mount, render } = require('enzyme');
import request from 'request';

test('API call with gameId should return information for a game with that id', (done) => {
  request('http://localhost:3000/api/overview/1', (err, res, body) => {
    let game = JSON.parse(body);
    expect(game[0].game_id).toBe(1);
    done();
  })
})

test('API call with gameId should contain all the necessary information for that game', (done) => {
  request('http://localhost:3000/api/overview/1', (err, res, body) => {
    /*
      game_id: Number,
      game_name: String,
      description: String,
      release_date: String,
      developer: String,
      publisher: String,
      tags: Array
    */
    let game = JSON.parse(body)[0];
    expect(game.hasOwnProperty('game_name')).toBe(true);
    expect(game.hasOwnProperty('tags')).toBe(true);
    expect(game.hasOwnProperty('description')).toBe(true);
    expect(game.hasOwnProperty('release_date')).toBe(true);
    expect(game.hasOwnProperty('developer')).toBe(true);
    expect(game.hasOwnProperty('publisher')).toBe(true);
    done();
  })
})

test('API POST should create a new db entry and DELETE should remove that entry', (done) => {
  const game = {
    game_id: 100000000,
    game_name: 'Best Game Evar',
    description: 'Microtransaction paradise',
    release_date: '2019-07-14',
    developer: 'EA',
    publisher: 'EA',
    tags: ['Microtransactions', 'Open World', 'Roguelike', 'Crafting']
  }

  request.post({ 
    url: 'http://localhost:3000/api/overview', 
    form: game 
  }).on('response', (response) => {
    expect(response.statusCode).toBe(201);
    request.delete('http://localhost:3000/api/overview/100000000').on('response', (response) => {
      expect(response.statusCode).toBe(200);
      request.get('http://localhost:3000/api/overview/100000000').on('response', (response) => {
        expect(response.body).toBe(undefined);
        done();
      })
    })
  })
})

test('API should update game by game_id with a PUT request', (done) => {
  request('http://localhost:3000/api/overview/1', (error, response, body) => {
    let game = JSON.parse(body);
    let form = {
      game_name: game.game_name + '-moded'
    }

    request.put({ 
      url: 'http://localhost:3000/api/overview/1',
      form: form
    }).on('response', (response) => {
      expect(response.statusCode).toBe(200)
      done()
    })
  })
})