var Patient = require('../../models/patient'),
    Advance = require('../../models/advance'),
    addAdvance = require('../../seed/addAdvance'),
    updatePatient = require('../../seed/updatePatient'),
    updateAdvance = require('../../seed/updateAdvance');

module.exports = {
    get: function(req, res, next) {
        var regId = req.query.regid;
        if (regId) {
            Patient.findOne({ "registrationid": regId }, function(err, docs) {
                if (err) return next(err);
                if (docs) {
                    if (!docs.admitDate) {
                        var datetime = new Date().toLocaleString();
                        docs.admitDate = datetime;
                    }
                    res.render('admission', { title: "Admission", patientObj: docs, loggedInUser: global.loggedInUser });
                } else
                    res.render('failure', { title: "Something Wrong!", message: "Registration id is not valid", loggedInUser: global.loggedInUser });
            });
        } else
            res.render('userinput', { title: "Fill Details", pageToRedirect: "admit", message: "Please provide registration id below", btnName: "Proceed To Patient Admit", localRegId: localStorage.getItem('localRegId'), loggedInUser: global.loggedInUser });

    },
    post: function(req, res, next) {
        var registrationId = req.body.regId;
        Patient.findOne({ "registrationid": registrationId }, function(err, docs) {
            if (err) return next(err);
            if (docs.isAdmitted) {
                res.render('success', { title: "Operation Success", page: 'admission', message: "Patient admitted already.", printbtn: "Print Admission Form", print: "true", patientObj: patientObj, loggedInUser: global.loggedInUser });
            } else {
                var patientObj = {
                        regId: registrationId,
                        admitDate: req.body.admitDate,
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
                        email: req.body.email,
                        guardianName: req.body.guardianName,
                        realationWithGuardian: req.body.relWithGuardian,
                        whoBoughtPatient: req.body.whoBought,
                        relationWithPatient: req.body.relWhoBought,
                        packageOffered: req.body.packageOffered
                    },
                    updateData = {
                        admitDate: req.body.admitDate,
                        guardianName: req.body.guardianName,
                        realationWithGuardian: req.body.relWithGuardian,
                        whoBoughtPatient: req.body.whoBought,
                        relationWithPatient: req.body.relWhoBought,
                        advanceAmount: req.body.advance,
                        isAdmitted: true,
                        modifiedBy: global.loggedInUser,
                        referer: req.body.referer,
                        refererPhone: req.body.refererPhone,
                        refererAmount: req.body.refererAmount
                    },
                    result = updatePatient(updateData, { registrationid: registrationId });
                if (result === 'success'){
                    if(updateData.advanceAmount){
                        Advance.findOne({ "registrationid": registrationId }, function(err, advanceDocs) {
                            if (err) return next(err);
                            var newAdvanceList = { 
                                advance: 'Advance paid at the time of Admission',
                                date: new Date().toLocaleString(),
                                advanceAmount:  updateData.advanceAmount
                            };
                            if (advanceDocs) {
                                advanceDocs.advanceList.push(newAdvanceList);
                                advanceDocs.totalAdvance = Number(advanceDocs.totalAdvance) + Number(updateData.advanceAmount);
                                advanceDocs.onAdmit = true;
                                advanceDocs.regId = advanceDocs.registrationid;
                                updateAdvance(res, advanceDocs);
                            } else {
                                var obj = { 
                                    regId: registrationId,
                                    advanceList:[ newAdvanceList ],
                                    totalAdvance: updateData.advanceAmount,
                                    modifiedBy: global.loggedInUser,
                                    onAdmit: true
                                }
                                addAdvance(res, obj);
                            }
                        });
                    }
                    res.render('success', { title: "Operation Success", page: 'admission', message: "Patient admission successfull.", printbtn: "Print Admission Form", print: "true", patientObj: patientObj, loggedInUser: global.loggedInUser });
                } else
                    res.render('failure', { title: "Something Wrong!", message: "Admission Unsuccessfull", loggedInUser: global.loggedInUser });
            }
        });
    }
};
