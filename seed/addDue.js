var Due = require('../models/due');

module.exports = function (res, dueObj) {
    new Due({
        registrationid: dueObj.regId,
        patientname: dueObj.patientname,
        dueList: dueObj.dueList,
        modifiedBy: dueObj.modifiedBy,
        totalDue: dueObj.totalDue,
        lastUpdated: dueObj.lastUpdated
    }).save(function(err, result){
        if(dueObj.onInvoice){
            if (err) throw err;
            else
                console.log("Due Saved Successfully to Due Collection");
        } else {
            if (err){
                res.status(500).send({statusCode: 500, message: "Something went wrong in saving your due."});                                             
            }
            if (result) { 
                res.status(200).send({statusCode: 200, message: "Due saved sucessfully."});
            }
        }
    });
};
 