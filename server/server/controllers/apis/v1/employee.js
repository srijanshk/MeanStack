const express = require('express');
const EmployeeService = require('../../../services/v1/employee/employee');
let router = express.Router();
var multer = require('multer');
var xlstojson = require("xls-to-json");
var xlsxtojson = require("xlsx-to-json");
var mongoose = require('mongoose');
var Employee = require('../../../models/employe')
var csv = require('fast-csv');

var storage = multer.diskStorage({
    
    destination: function(req, file, cb) {
        cb(null, 'uploads');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
});

var upload = multer({ //multer settings
    storage: storage
}).single('file')


router.post('/import', upload, (req, res, next) => {
    const file  = req.file;
    var employees = [];

  var exceltojson;
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
            console.log(data)
            data['_id'] = new mongoose.Types.ObjectId();
    
            employees.push(data);
            console.log(employees)
        })
        .on("end", function() {
            Employee.create(employees, function(err, documents) {
                if (err) throw err;
    
                res.send(documents)
            });
        });
      }

     else{

      if (req.file.originalname.split('.')[req.file.originalname.split('.').length - 1] === 'xlsx') {
        exceltojson = xlsxtojson;
      } else {
        exceltojson = xlstojson;
      }
      try {
        exceltojson({
          input: req.file.path,
          output: null,
          lowerCaseHeaders: true
        }, function (err, result) {
          if (err) {
            return res.json({ error_code: 1, err_desc: err, data: null });
          }

        //   result['_id'] = new mongoose.Types.ObjectId();
          employees.push(result);
          const headers = Object.keys(result[0]);
          console.log(result)
          Employee.create(employees, function(err, documents) {
              if (err) throw err;

              res.send(documents)
          })
          
        //   console.log(result)
        });
      } catch (e) {
        res.json({ error_code: 1, err_desc: "Corupted excel file" });
      }
    }

    }
  catch (e) {
    console.log(e);
  }

});

module.exports = router;