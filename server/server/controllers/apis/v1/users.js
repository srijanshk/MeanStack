const express = require('express');
const userService = require('../../../services/v1/users/users');
const authClientRequest = require('../../../middlewares/authGuard');
let router = express.Router();


router.get('/:userId', authClientRequest.authClientToken ,userService.getUserDetails);

module.exports = router;