var Patient = require('../../models/patient'),
    PackageHistory = require('../../models/packageHistory'),
    updatePatient = require('../../seed/updatePatient');
    addPackageHistory = require('../../seed/addPackageHistory');
module.exports = {
    get: function(req, res, next) {
        var regId = req.query.regid;
        if (regId) {
            Patient.findOne({ "registrationid": regId }, function(err, patientDocs) {
                if (err) return next(err);
                if (patientDocs) {
                    PackageHistory.find({ "registrationId": regId }, function (err, packageHistoryDocs) {
                        if (err) return next(err);
                        console.log(packageHistoryDocs);
                        res.render('package', { title: "Package", patientObj: patientDocs, packageHistoryObj: packageHistoryDocs, loggedInUser: global.loggedInUser });
                    });
                } else
                    res.render('failure', { title: "Something Wrong!", message: "Registration id is not valid", loggedInUser: global.loggedInUser });
            });
        } else
            res.render('userinput', { title: "Fill Details", pageToRedirect: "package", message: "Please provide registration id below", btnName: "Proceed To Package", localRegId: localStorage.getItem('localRegId'), loggedInUser: global.loggedInUser });

    },
    post: function(req, res, next) {
        var patientObj = {
                regId: req.body.regId,
                patientName: req.body.patientname,
                packagetextarea: req.body.packagetextarea,
                packageAmount: req.body.packageAmount,
                packageOfferedBy: req.body.packageOfferedBy
            },
            updateData = {
                packagetextarea: req.body.packagetextarea,
                packageAmount: req.body.packageAmount,
                packageOfferedBy: req.body.packageOfferedBy
            },
            result = updatePatient(updateData, { registrationid: req.body.regId });
        if (result === 'success'){
            var packageObj = {
                registrationId: patientObj.regId,
                packageTextarea: patientObj.packagetextarea,
                packageAmount: patientObj.packageAmount,
                packageOfferedBy: patientObj.packageOfferedBy,
                packageOfferedDate: new Date().toLocaleString()
            };
            var response = addPackageHistory(packageObj);
            if (response === 'success')
                res.render('success', { title: "Operation Success", page: 'package', message: "Package is Set.", printbtn: "Print Package Declaration", print: "true", patientObj: patientObj, loggedInUser: global.loggedInUser });
            else
                res.render('failure', { title: "Something Wrong!", message: "Package history addition unsuccessfull", loggedInUser: global.loggedInUser });
        } else {
            res.render('failure', { title: "Something Wrong!", message: "Package update Unsuccessfull", loggedInUser: global.loggedInUser });
        }
    }
};
