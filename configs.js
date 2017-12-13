/**
* redis-web-token sample with Node.js
*
* Author: Alexandre PENOMBRE <aluzed@gmail.com>
* Copyright 2017
*/
module.exports = {
  security: {
    secret     : 'superNinja',
    salt       : '@ppl3',
    pepper     : 'p33|2',
    sessionTTL : 60*60*4 // 4 hours
  },
  redis: {
    host: 'localhost',
    port: 6379,
    prefix: 'sess:'
  },
  mongodb: {
    uri: 'mongodb://localhost:27017/rwt_test'
  }
}
