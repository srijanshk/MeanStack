
const employeeModel = require('../../../models/employe');
const { validationResult } = require('express-validator/check');
const sheetimport = require('../../../middlewares/importMiddleware')
var mongoose = require('mongoose');
var csv = require('fast-csv');
var xlsx = require('xlsx');
const fs = require('fs');


const importsheet = (req,res, next) => {

    const file  = req.file;
    var employees = [];

  try {
      /** Multer gives us file info in req.file object */
      if (!req.file) {
        res.json({ error_code: 1, err_desc: "No file passed" });
        return;
      }

      if(req.file.mimetype == "text/csv") {
        var importFile = req.file;

       
    
        csv
        .fromPath(importFile.path, {
            headers: true,
            ignoreEmpty: true
        })
        .on("data", function(data) {
            data['_id'] = new mongoose.Types.ObjectId();
    
            employees.push(data);
        })
        .on("end", function() {
            fs.unlinkSync(req.file.path); 

            employeeModel.create(employees, function(err, documents) {
                if (err) throw err;
    
                res.send(documents)
                
            });
        });
      }

     else{
         const workbook = xlsx.readFile(req.file.path);
         const sheet_name = workbook.SheetNames;
         csvfile = xlsx.utils.sheet_to_csv(workbook.Sheets[sheet_name[0]]);

         csv
        .fromString(csvfile, {
            headers: true,
            ignoreEmpty: true
        })
        .on("data", function(data) {
            data['_id'] = new mongoose.Types.ObjectId();
    
            employees.push(data);
        })
        .on("end", function() {

              fs.unlinkSync(req.file.path); 

            
            employeeModel.create(employees, function(err, documents) {
                if (err) throw err;
    
                res.send(documents)
                
            });
        });
    }

    }
  catch (e) {
    console.log(e);
  }
}

const getAllEmployeeDetails = async (req,res, next) => {
    let employees = await employeeModel.find().sort({'created_at': -1}).select('-__v');

    if(!employees){
        return res.status(404).json({
            "errors":[{
                "msg" : " no employees found"
            }]
        })
    }

    return res.status(200).json(
        employees
    );
}

const getEmployeeDetails = async (req,res, next) => {
    let { userId } = req.params;
    
    let employee = await employeeModel.findById(userId).select('-__v');

    if(!employee) {
        return res.status(404).json({
            "errors":[{
                "msg" : " no employee found"
            }]
        })
    }
    return res.status(200).json({
        "success" : [{
            "msg" : " employee fetched successfully",
            "data" : employee
        }]
    })

}


const updateEmployee = async (req,res, next) => {
    if (!req.file) {
        res.json({ error_code: 1, err_desc: "No file passed" });
        return;
      }
    var url = req.protocol + '://' + req.get("host");
    var imagepath = url + "/uploads/" + req.file.filename;

    let { userId } = req.params;

    let { fullname, DOB, gender, salary, designation } = req.body;

    try {
        let employee = await employeeModel.findByIdAndUpdate(userId, {
            fullname : fullname,
            DOB : DOB,
            gender : gender,
            salary : salary,
            designation : designation,
            profilePicture : imagepath

        });
        if(!employee){
            throw new error();
        }

        return res.status(201).json({
            "success" : [{
                "msg" : "Employee Added Successfully"
            }]
        });
    }catch(error){
        console.log(error);
        return res.status(500).json(
            { 
                "errors" : [{
                    "msg": "there was a problem Adding new Employee."   
                }]
            }
        );
    }
}

const AddnewEmployee = async (req,res,next) => {
    const errors = validationResult(req);
    if (!req.file) {
        res.json({ error_code: 1, err_desc: "No file passed" });
        return;
      }
    var url = req.protocol + '://' + req.get("host");
    var imagepath = url + "/uploads/" + req.file.filename;


    if(!errors.isEmpty()){
        return res.status(422).json({ errors: errors.array() });
    }

    

    let { fullname, DOB, gender, salary, designation, image } = req.body;

    try {
        let employee = await employeeModel.create({
            fullname : fullname,
            DOB : DOB,
            gender : gender,
            salary : salary,
            designation : designation,
            profilePicture : imagepath

        });

        if(!employee){
            throw new error();
        }

        return res.status(201).json({
            "success" : [{
                "msg" : "Employee Added Successfully"
            }]
        });
    }catch(error){
        console.log(error);
        return res.status(500).json(
            { 
                "errors" : [{
                    "msg": "there was a problem Adding new Employee."   
                }]
            }
        );
    }
}


    
module.exports = {
    importsheet : importsheet,
    getAllEmployeeDetails : getAllEmployeeDetails,
    getEmployeeDetails : getEmployeeDetails,
    AddnewEmployee : AddnewEmployee,
    updateEmployee : updateEmployee,
}