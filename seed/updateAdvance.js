var Advance = require('../models/advance');

var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/patientdb');

module.exports = function (res, advanceObj) {
    var updateData = {
        advanceList: advanceObj.advanceList,
        modifiedBy: advanceObj.modifiedBy,
        totalAdvance: advanceObj.totalAdvance
    };
    Advance.findOneAndUpdate({ registrationid: advanceObj.regId }, updateData, {upsert:true}, function(err, doc){
        if (advanceObj.onAdmit){
            if (err) throw err;
            else {
               console.log("Successfully updated advancce pay on admission.");
            }
        } else{
            if (err)
                res.status(500).send({statusCode: 500, message: "Something went wrong in updating your advance."});                                             
            else
                res.status(200).send({statusCode: 200, message: "Advance updated sucessfully."});
        }                                         
    });
};
