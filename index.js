/**
* redis-web-token sample with Node.js
*
* Author: Alexandre PENOMBRE <aluzed@gmail.com>
* Copyright 2017
*/
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const User = require('./models/user');
const bodyParser = require('body-parser');
const config = require('./configs');
const rwt = require('redis-web-token')({
  redis: config.redis,
  custom: {
    expire: config.security.sessionTTL,
    verifyExtendsToken: false
  }
});
global.Promise = require('bluebird');
mongoose.Promise = global.Promise;

mongoose.connect(config.mongodb.uri, { useMongoClient: true });
app.use(bodyParser.json());

app.post('/login', (req, res) => {
  const credentials = req.body;

  if(typeof credentials !== 'object')
    return res.status(400).send('Missing credientials');

  if(Object.keys(credentials).length === 0)
    return res.status(400).send('Missing credientials');

  User.authenticate(credentials.username, credentials.password, (err, user) => {
    if(err || !user)
      return res.status(403).send('Authentication error : wrong username or password');

    rwt.sign({ username: user.username, password: user.password, created: user.created, modified: user.modified }, config.security.secret, config.security.sessionParams, (er, token) => {
      if(er)
        return res.status(403).send('Authentication error : invalid token');

      return res.json({ token });
    })
  })
});

app.post('/logout', (req, res) => {
  let token = req.body.token || req.query.token || req.headers['x-access-token'];

  if (!token)
    return res.status(403).send('Forbidden');


  rwt.destroy(token, config.security.secret, (err) => {
    if (err)
      return res.status(403).send('Forbidden');

    return res.send('disconnected');
  });
});

app.post('/setup', (req, res) => {
  User.findOne({ username: 'admin' }, (err, user) => {
    if(err)
      return res.status(500).send('Database error');

    if(!user) {
      const user = new User({
        username: 'admin',
        password: 'azerty'
      });

      user.save((err) => {
        if(err)
          return res.status(500).send('Error, unable to save user');

        return res.json(user);
      })
    }
    else {
      return res.status(400).send('User already exists');
    }
  });
});

app.get('/', (req, res) => res.send('ok'));

app.get('/private', (req, res, next) => {
  // Token test middleware
  let token = req.body.token || req.query.token || req.headers['x-access-token'];

  if(!token)
    return res.status(403).send('Forbidden');


  rwt.verify(token, config.security.secret, (err, user) => {
    if(err || !user)
      return res.status(403).send('Forbidden');

    return next();
  });
}, (req, res) => {
  return res.send('private');
});

app.listen(3000, () => {
  console.log('Listening on 3000');
});
