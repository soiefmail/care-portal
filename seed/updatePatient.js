var Patient = require('../models/patient');

module.exports = function (updateData, query) {
    Patient.findOneAndUpdate(query, updateData, {upsert:true}, function(err, doc){
        if (err) return res.send(500, { error: err });
        console.log("succesfully updated "+query.registrationid);
    });
    return 'success';
};
