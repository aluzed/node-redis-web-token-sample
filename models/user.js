/**
* redis-web-token sample with Node.js
*
* Author: Alexandre PENOMBRE <aluzed@gmail.com>
* Copyright 2017
*/
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const config = require('../configs');

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  created: { type: Date, default: Date.now },
  modified: { type: Date, default: Date.now }
});

/**
* Hash our password
*
*/
UserSchema.pre('save', function(next) {
  this.password = bcrypt.hashSync(config.security.salt + this.password + config.security.pepper, 10);
  next();
});

/**
 * Authenticate Static Method
 *
 * @param {String} username
 * @param {String} password
 * @return {Function} callback(err, user || null)
 */
UserSchema.statics.authenticate = function(username, password, callback) {
  this.findOne({ username }, (err, user) => {
    if(err)
      callback(err);

    user = bcrypt.compareSync(config.security.salt + password + config.security.pepper, user.password) ? user : null;

    callback(null, user);
  });
};

module.exports = mongoose.model('User', UserSchema);
