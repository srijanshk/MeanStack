const userController = require('../../controllers/apis/v1/users');
const authController = require('../../controllers/apis/v1/auth');
const employeeController = require('../../controllers/apis/v1/employee');

const express = require('express');
let router = express.Router();
router.use('/users', userController);
router.use('/auth', authController);
router.use('/employee', employeeController)

module.exports = router;