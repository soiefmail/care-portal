var Patient = require('../../models/patient'),
    updatePatient = require('../../seed/updatePatient');
module.exports = {
    get: function(req, res, next) {
        var regId = req.query.regid;
        if (regId) {
            Patient.findOne({ "registrationid": regId }, function(err, docs) {
                if (err) return next(err);
                if (docs) {
                    if (docs.isAdmitted) {
                        if (!docs.dischargeDate) {
                            var datetime = new Date().toLocaleString();
                            docs.dischargeDate = datetime;
                        }
                        res.render('discharge', { title: "Discharge", patientObj: docs, loggedInUser: global.loggedInUser });
                    } else {
                        res.render('failure', { title: "Something Wrong!", message: "Admit the Patient first", loggedInUser: global.loggedInUser });
                    }
                } else
                    res.render('failure', { title: "Something Wrong!", message: "Registration id is not valid", loggedInUser: global.loggedInUser });
            });
        } else
            res.render('userinput', { title: "Fill Details", pageToRedirect: "discharge", message: "Please provide registration id below", btnName: "Proceed To Patient Discharge", localRegId: localStorage.getItem('localRegId'), loggedInUser: global.loggedInUser });
    },
    post: function(req, res, next) {
        Patient.findOne({ "registrationid": req.body.regId }, function(err, docs) {
            if (err) return next(err);
            if (docs) {
                if (docs.isDischarged)
                    res.render('success', { title: "Operation Success", page: 'discharge', message: "Patient discharged already.", printbtn: "Print Discharge Form", print: "true", patientObj: docs, loggedInUser: global.loggedInUser });
                else {
                    if (docs.isAdmitted) {
                        var patientObj = {
                                registrationid: req.body.regId,
                                dischargeDate: req.body.dischargeDate,
                                patientName: req.body.patientname,
                                underDoctor: req.body.underdoc,
                                sufferingFrom: req.body.sufferfrom,
                                age: req.body.age,
                                management: req.body.management,
                                admitDate: req.body.admitDate,
                                guardianName: req.body.guardianName,
                                realationWithGuardian: req.body.relWithGuardian,
                                village: req.body.village,
                                postOffice: req.body.po,
                                policeStation: req.body.ps,
                                district: req.body.dist,
                                state: req.body.state,
                                primaryPhoneNo: req.body.pphone,
                                secondaryPhoneNo: req.body.sphone,
                                email: req.body.email
                            },
                            updateData = {
                                dischargeDate: req.body.dischargeDate,
                                management: req.body.management,
                                isDischarged: true,
                                dischargedBy: global.loggedInUser
                            },
                            result = updatePatient(updateData, { registrationid: req.body.regId });
                        if (result === 'success')
                            res.render('success', { title: "Operation Success", page: 'discharge', message: "Patient discharged successfully.", printbtn: "Print Discharge Form", print: "true", patientObj: patientObj, loggedInUser: global.loggedInUser });
                        else
                            res.render('failure', { title: "Something Wrong!", message: "Discharge Unsuccessfull", loggedInUser: global.loggedInUser });
                    } else
                        res.render('failure', { title: "Something Wrong!", message: "Admit the Patient first.", loggedInUser: global.loggedInUser });
                }
            } else
                res.render('failure', { title: "Something Wrong!", message: "Registration id is not valid", loggedInUser: global.loggedInUser });
        });
    }
};
