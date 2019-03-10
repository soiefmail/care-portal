var Patient = require('../../models/patient');

module.exports = {
    get: function (req, res, next) {
        var regId = req.query.regid;
        if (regId) {
            Patient.findOne({ "registrationid": regId }, function(err, docs) {
                if (err) return next(err);
                if (docs) {
                    res.render('putidentification', { title: "Change Aadhar or Voter Id", patientObj: docs });
                } else
                    res.render('failure', { title: "Something Wrong!", message: "Registration id is not valid", loggedInUser: global.loggedInUser });
            });
        } else {
            res.render('userinput', { title: "Fill Details", pageToRedirect: "putidentification", message: "Please provide registration id below", btnName: "Update Aadhar / Voter Id", localRegId: localStorage.getItem('localRegId'), loggedInUser: global.loggedInUser });
        }
    },
    post: function (req, res, next) {
        Patient.findOneAndUpdate({ registrationid: req.body.regId }, { aadharVoterId: req.body.aadhar }, {upsert:true}, function(err, doc){
            if (err)
                res.render('failure', { title: "Something Wrong!", message: "Failed to update aadhar/voter card", loggedInUser: global.loggedInUser });                                                  
            else {
                var patientObj = {
                    registrationid: req.body.regId,
                    aadharVoterId: req.body.aadhar
                };
                res.render('putidentification', { title: "Change Aadhar or Voter Id", updateMessage:"Updated Successfully", patientObj: patientObj });            
            }
        });
    }
};
