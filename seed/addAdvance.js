var Advance = require('../models/advance');

var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/patientdb');

module.exports = function (res, advanceObj) {
    new Advance({
        registrationid: advanceObj.regId,
        advanceList: advanceObj.advanceList,
        modifiedBy: advanceObj.modifiedBy,
        totalAdvance: advanceObj.totalAdvance
    }).save(function(err, result){
        if (advanceObj.onAdmit){
            if (err) throw err;
            if (result){
               console.log("Successfully added advancce pay on admission.");
            }
        } else{
            if (err){
                res.status(500).send({statusCode: 500, message: "Something went wrong in saving your advance."});                                             
            }
            if (result) { 
                res.status(200).send({statusCode: 200, message: "Advance saved sucessfully."});
            };
        } 
    });
};
