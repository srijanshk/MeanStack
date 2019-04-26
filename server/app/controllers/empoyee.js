var csv = require('fast-csv');
var mongoose = require('mongoose');
var Employee = require('../models/employees');
var json2csv = require('json2csv').parse;
var xlsx = require('node-xlsx');
var multer = require('multer');
var fs = require('fs');



var storage = multer.diskStorage({
    
    destination: function(req, file, cb) {
        cb(error, 'uploads');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname)
    }
});

var upload = multer({ //multer settings
    storage: storage
}).single('file');

exports.postimport = function(req, res) {
  

    if (!req.files) {
        return res.status(400).send('No files were uploaded.');
    }

    if (req.files.file.mimetype == "text/csv")
     {
         
        var importFile = req.files.file;

    var employees = [];

    csv
    .fromString(importFile.data.toString(), {
        headers: true,
        ignoreEmpty: true
    })
    .on("data", function(data) {
        data['_id'] = new mongoose.Types.ObjectId();

        employees.push(data);
    })
    .on("end", function() {
        Employee.create(employees, function(err, documents) {
            if (err) throw err;

            res.send(employees.length + 'employees have been successfully added to the list')
        });
    });
    } 
    
    if (req.files.file.mimetype == "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") 
    {

        upload(req, res,function(err, result) {
            if (err) {
                res.send(err)
            }
            

            else {

            var obj = xlsx.parse('./uploads/' + req.files.file.name); // parses a file
            var rows = [];
            var writeStr = "";
        
            //looping through all sheets
            for (var i = 0; i < obj.length; i++) {
                var sheet = obj[i];
                //loop through all rows in the sheet
                for (var j = 0; j < sheet['data'].length; j++) {
                    //add the row to the rows array
                    rows.push(sheet['data'][j]);
                }
            }
            //creates the csv string to write it to a file
            for (var i = 0; i < rows.length; i++) {
                writeStr += rows[i].join(",") + "\n";
            }
            //writes to a file, but you will presumably send the csv as a
            //response instead
            fs.writeFile('./uploads/' + req.files.file.name, writeStr, function (err) {
                if (err) {
                    return console.log(err);
                }
                console.log("csv was saved in the current directory!");
        
        
        
        
        
                // To add headers in CSV
                var fd = fs.openSync('./uploads/' + req.files.file.name, 'a+');
                var data = fs.readFileSync('./uploads/' +req.files.file.name); //read existing contents
                var fd = fs.openSync('./uploads/' + req.files.file.name, 'w+');
                var buffer = new Buffer('field1\n');
        
                fs.writeSync(fd, buffer, 0, buffer.length, 0); //write new data
                fs.writeSync(fd, data, 0, data.length, buffer.length); //append old data
                // or fs.appendFile(fd, data);
                // fs.close(fd);
        
        
        
                // convert csv into Json
                var Converter = require("csvtojson").Converter;
                var converter = new Converter({});
                converter.fromFile('./uploads/' + req.files.file.name, function (err,
                    result) {
                    if (err) {
                        console.log("An Error Has Occured");
                        console.log(err);
                    }
                    var data = result;
                    console.log('data=>>>>>>', data);
                    return res.status(200).send(data);
                });
            });
        }
        });

}

  
}


exports.getfields = function(req, res) {
    var fields = [
        'fullname',
        'DOB',
        'gender',
        'salary',
        'designation'
    ];

    var csv = json2csv({data: '', fields: fields});
    // console.log(csv)

    res.set("Content-Disposition", "attachment;filename=upload.csv");
	res.set("Content-Type", "application/octet-stream");

    res.send(csv);
}