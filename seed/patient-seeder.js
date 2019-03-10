var Patient = require('../models/patient');

var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/patientdb');

var patients = [
    new Patient({
        patientName: 'XYZ',
        patientDOB: '20-04-1994',
        phoneNo: 9898989856
    }),
    new Patient({
        patientName: 'SDF',
        patientDOB: '21-04-1994',
        phoneNo: 9008989856
    }),
    new Patient({
        patientName: 'MAruf',
        patientDOB: '21-04-1979',
        phoneNo: 7008989856
    })
];

var done = 0;
for (var i = 0; i < patients.length; i++) {

    patients[i].save(function(err, result){
        if(err) throw err;
        done++;
        if(done === patients.length){
            exit();
        }
    });   
}

function exit(){
    console.log('dissconnected');
    
    mongoose.disconnect();
}
