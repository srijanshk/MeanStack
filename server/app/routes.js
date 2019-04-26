var AuthenticationController = require('./controllers/authentication'),
    express = require('express'),
    passportService = require('../config/passport'),
    EmployeeController = require('./controllers/empoyee'),
    passport = require('passport');

var requireAuth = passport.authenticate('jwt', {
        session: false
    }),
    requireLogin = passport.authenticate('local', {
        session: false
    });

module.exports = function (app) {
    var apiRoutes = express.Router(),
        authRoutes = express.Router();
        employeeRoutes = express.Router();
    // Auth Routes


    apiRoutes.use('/auth', authRoutes);

    authRoutes.post('/register' ,requireAuth, AuthenticationController.register);
    authRoutes.post('/login', requireLogin, AuthenticationController.login);

    authRoutes.get('/protected', requireAuth, function (req, res) {
        res.send({
            content: 'Success'
        });
    });


    //employee Routes

    apiRoutes.use('/employee', employeeRoutes);
     employeeRoutes.post('/', EmployeeController.postimport);
     employeeRoutes.get('/template', EmployeeController.getfields);


    //set up routes
    app.use('/api', apiRoutes);
}