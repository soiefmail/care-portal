var Due = require('../models/due');

module.exports = function (res, dueObj) {
    var updateData = {
        dueList: dueObj.dueList,
        totalDue: dueObj.totalDue,
        loggedInUser: dueObj.loggedInUser,
        lastUpdated: dueObj.lastUpdated
    };
    Due.findOneAndUpdate({ registrationid: dueObj.regId }, updateData, {upsert:true}, function(err, doc){
        if(dueObj.onInvoice){
            if (err) throw err;
            else
                console.log("Due Updated Successfully to Due Collection");
        } else {
            if (err)
                res.status(500).send({statusCode: 500, message: "Something went wrong in updating your due."});                                             
            else
                res.status(200).send({statusCode: 200, message: "Due updated sucessfully."});
        }                                           
    });
};
