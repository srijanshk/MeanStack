const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const expressValidator = require('express-validator');
const log = require('morgan')
const path = require('path')
const cors = require('cors')

module.exports = function () {
    let server = express(),
        create,
        start;

    create = (config, db) => {
        let routes = require('../routes');
        // set all the server things
        server.set('env', config.env);
        server.set('port', config.port);
        server.set('hostname', config.hostname);
        
        server.use(function(req, res, next) { //allow cross origin requests
            res.setHeader("Access-Control-Allow-Origin", "*");
            res.setHeader("Access-Control-Allow-Headers","Origin, X-Requested-With, Content-Type, Accept, token");
            res.setHeader("Access-Control-Allow-Methods","GET, POST, PATCH, PUT, DELETE, OPTIONS");
            res.header("Access-Control-Allow-Headers","*")
            next();
        });
        // add middleware to parse the json
        server.use(bodyParser.json());
        server.use(expressValidator())
        server.use(bodyParser.urlencoded({
            extended: false
        }));
        server.use('/uploads', express.static(path.join('uploads')))
        server.use(log('combined'));

        //connect the database
        mongoose.connect(
            db.database,
            { 
                useNewUrlParser: true,
                useCreateIndex: true
            }
        );

        require('./seed');

        // Set up routes
        routes.init(server);
    };

    
    start = () => {
        let hostname = server.get('hostname'),
            port = server.get('port');
        server.listen(port, function () {
            console.log('Express server listening on - http://' + hostname + ':' + port);
        });
    };
    return {
        create: create,
        start: start
    };
};