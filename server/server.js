const server = require('./config/app')();
const config = require('./config/env_config/config');
const db = require('./config/db');

//create the basic server setup 
server.create(config, db);

//start the server
server.start();