var Patient = require('../../models/patient');

module.exports = {
    get: function (req, res, next) {
        var regId = req.query.regid;
        if (regId) {
            Patient.findOne({ "registrationid": regId }, function(err, docs) {
                if (err) return next(err);
                if (docs) {
                    res.render('patientdetails', { title: "Patient Details", patientObj: docs });
                } else
                    res.render('failure', { title: "Something Wrong!", message: "Registration id is not valid", loggedInUser: global.loggedInUser });
            });
        } else {
            res.render('userinput', { title: "Fill Details", pageToRedirect: "patientdetails", message: "Please provide registration id below", btnName: "Get Patient Details", localRegId: localStorage.getItem('localRegId'), loggedInUser: global.loggedInUser });
        }
    }
};
