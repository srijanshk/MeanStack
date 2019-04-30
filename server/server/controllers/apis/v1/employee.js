const express = require('express');
const EmployeeService = require('../../../services/v1/employee/employee');
const authClientRequest = require('../../../middlewares/authGuard');
let router = express.Router();
const sheetimport = require('../../../middlewares/importMiddleware')




router.post('/import', sheetimport.upload.single('file'), EmployeeService.importsheet)
router.get('/', authClientRequest.authClientToken ,EmployeeService.getAllEmployeeDetails);
router.get('/:userId', authClientRequest.authClientToken ,EmployeeService.getEmployeeDetails);
router.post('/', authClientRequest.authClientToken ,EmployeeService.AddnewEmployee);

module.exports = router;