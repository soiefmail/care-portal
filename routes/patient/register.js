var Patient = require('../../models/patient'),
    DeletedPatient = require('../../models/deletedPatient'),
    addPatient = require('../../seed/addPatient');
module.exports = {
    get: function(req, res, next) {
        Patient.find({}, function(err, patientDocs) {
            if (err) return next(err);
            DeletedPatient.find({}, function(err, deletedPatientDocs) {
                if (err) return next(err);
                var date = new Date(),
                    datetime = date.toLocaleString(),
                    count = patientDocs.length + deletedPatientDocs.length + 1,
                    currmonth = ("0" + (date.getMonth() + 1)).slice(-2),
                    regId = count + "/CARE/IPD/" + currmonth + "/" + date.getFullYear();
                res.render('registration', { title: "Register", regId: regId, registrationDate: datetime, loggedInUser: global.loggedInUser });
            });
        });
    },
    post: function(req, res, next) {
        localStorage.setItem('localRegId', req.body.regId);
        var patientObj = {
                regId: req.body.regId,
                registrationDate: req.body.registrationDate,
                patientName: req.body.patientname,
                underDoctor: req.body.underdoc,
                sufferingFrom: req.body.sufferfrom,
                sex: req.body.sex,
                age: req.body.age,
                aadharVoterId: req.body.aadhar,
                admissionType: req.body.admissionType,
                paymentType: req.body.paymentType,
                village: req.body.village,
                postOffice: req.body.po,
                policeStation: req.body.ps,
                district: req.body.dist,
                state: req.body.state,
                primaryPhoneNo: req.body.pphone,
                secondaryPhoneNo: req.body.sphone,
                email: req.body.email
            },
            result = addPatient(patientObj);
        if (result === 'success')
            res.render('success', { title: "Success", page: 'registration', message: "Patient has been successfully registered.", printbtn: "Print Registration Form", print: "true", patientObj: patientObj, loggedInUser: global.loggedInUser });
        else
            res.render('failure', { title: "Something Wrong!", message: "Registration Unsuccessfull", loggedInUser: global.loggedInUser });
    }
};
