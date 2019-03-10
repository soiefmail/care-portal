var PackageHistory = require('../models/packageHistory');

var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/patientdb');

module.exports = function (packageObj) {
    new PackageHistory({
        registrationId: packageObj.registrationId,
        packageTextarea: packageObj.packageTextarea,
        packageAmount: packageObj.packageAmount,
        packageOfferedBy: packageObj.packageOfferedBy,
        packageOfferedDate: packageObj.packageOfferedDate
    }).save(function(err, result){
        if (err) throw err;
        if (result) { 
            console.log('Succefully Inserted');
        };
    });
    return 'success';
};
