const express = require('express');
const EmployeeService = require('../../../services/v1/employee/employee');
const authClientRequest = require('../../../middlewares/authGuard');
let router = express.Router();
const sheetimport = require('../../../middlewares/importMiddleware');
const imageupload = require('../../../middlewares/imageuploadmiddleware');



router.post('/import', sheetimport.single('file'), EmployeeService.importsheet)
router.get('/', authClientRequest.authClientToken ,EmployeeService.getAllEmployeeDetails);
router.get('/:userId', authClientRequest.authClientToken ,EmployeeService.getEmployeeDetails);
router.post('/', authClientRequest.authClientToken ,EmployeeService.AddnewEmployee);
router.put('/:userId',  authClientRequest.authClientToken ,EmployeeService.updateEmployee);
router.put('/image/:userId', imageupload.single('image'), authClientRequest.authClientToken ,EmployeeService.uploadEmployeeImage);

module.exports = router;