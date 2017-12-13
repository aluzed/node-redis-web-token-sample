# Redis Web Token Node.js sample

## Usage
```
npm i

# Edit the configs.js file

node index.js
```

## Requirements

* Redis server
* Mongo DB server

## Your REST client

You can use both curl or POSTMAN if you prefer.

## Routes

Call :

* [POST] : http://localhost:3000/setup : to create your first user { username: 'admin', password: 'azerty' }
* [POST] : http://localhost:3000/login : with your credentials in your raw body JSON format (use double quote)
* [GET]  : http://localhost:3000/private : with your token in the headers (x-access-token key)
* [POST] : http://localhost:3000/logout : to disconnect and destroy your token
