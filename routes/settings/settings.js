var Patient = require('../../models/patient'),
    DeletedPatient = require('../../models/deletedPatient'),
    PackageHistory = require('../../models/packageHistory'),
    Invoice = require('../../models/invoice'),
    Due = require('../../models/due'),
    Advance = require('../../models/advance'),
    User = require('../../models/user'),
    updatePatient = require('../../seed/updatePatient'),
    _ = require('lodash');

function collectionStats(req, next, Collection, property) {
    Collection.collection.stats(function(err, stats) {
        if (err) return next(err);;
        req[property] = niceBytes(stats.size);
        return next();
    });
}

function niceBytes(x) {
    var units = ['bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
        l = 0,
        n = parseInt(x, 10) || 0;

    while (n >= 1024 && ++l)
        n = n / 1024;

    return (n.toFixed(n >= 10 || l < 1 ? 0 : 1) + ' ' + units[l]);
}

function getMemorySizes (req) {
    var memoryObj = {
        patientCollectionSize: req.patientCollectionSize,
        invoiceStorageSize: req.invoiceStorageSize,
        dueStorageSize: req.dueStorageSize,
        advanceStorageSize: req.advanceStorageSize,
        userStorageSize: req.userStorageSize,
        packageHistoryStorageSize: req.packageHistoryStorageSize
    };
    return memoryObj;
}

module.exports = {
    get: function(req, res, next) {
        if (global.loggedInUser === "admin") {
            User.find({}, function(err, users) {
                if (err) return next(err);
                res.render('settings', { title: "Settings", memorySizes: getMemorySizes(req), users: users, loggedInUser: global.loggedInUser });
            });
        } else {
            res.render('failure', { title: "Something Wrong!", message: "You are not authorized to view this page. Kindly contact your administrator", menuHide: true });
        }
    },
    findPatientStorageSize: function(req, res, next) {
        collectionStats(req, next, Patient, 'patientCollectionSize');
    },
    findInvoiceStorageSize: function(req, res, next) {
        collectionStats(req, next, Invoice, 'invoiceStorageSize');
    },
    findDueStorageSize: function(req, res, next) {
        collectionStats(req, next, Due, 'dueStorageSize');
    },
    findAdvanceStorageSize: function(req, res, next) {
        collectionStats(req, next, Advance, 'advanceStorageSize');
    },
    findUserStorageSize: function(req, res, next) {
        collectionStats(req, next, User, 'userStorageSize');
    },
    findPackageHistoryStorageSize: function(req, res, next) {
        collectionStats(req, next, PackageHistory, 'packageHistoryStorageSize');
    },
    post: function(req, res, next) {
        if (req.body.regIdUpdate || req.body.phoneUpdate) {
            if (req.body.regIdUpdate) {
                Patient.findOne({ "registrationid": req.body.regIdUpdate }, function(err, patientDocs) {
                    if (err) return next(err);
                    if (patientDocs) {
                        res.render('settings', { title: "Settings", memorySizes: getMemorySizes(req), patientObj: patientDocs, loggedInUser: global.loggedInUser });
                    } else
                        res.render('failure', { title: "Something Wrong!", message: "Registration id is not valid", loggedInUser: global.loggedInUser });
                });
            } else {
                Patient.findOne({ "primaryPhoneNo": req.body.phoneUpdate }, function(err, patientDocs) {
                    if (err) return next(err);
                    if (patientDocs) {
                        res.render('settings', { title: "Settings", memorySizes: getMemorySizes(req), patientObj: patientDocs, loggedInUser: global.loggedInUser });
                    } else
                        res.render('failure', { title: "Something Wrong!", message: "Registration id is not valid", loggedInUser: global.loggedInUser });
                });
            }
        } else if (req.body.regIdDelete) {
            Patient.findOne({ "registrationid": req.body.regIdDelete }, function(err, patientDocs) {
                if (err) return next(err);
                if (patientDocs) {
                    res.render('settings', { title: "Settings", memorySizes: getMemorySizes(req), regIdToDelete: patientDocs.registrationid, ptNameToDelete: patientDocs.patientName, loggedInUser: global.loggedInUser });
                } else
                    res.render('failure', { title: "Something Wrong!", message: "Registration id is not valid", loggedInUser: global.loggedInUser });
            });
        } else if (req.body.regId) {
            Patient.findOne({ "registrationid": req.body.regId }, function(err, patientDocs) {
                if (err) return next(err);
                if (patientDocs) {
                    var updateData = {
                        admitDate: req.body.admitDate,
                        registrationDate: req.body.regDate,
                        dischargeDate: req.body.dischargeDate,
                        patientName: req.body.patientname,
                        underDoctor: req.body.underdoc,
                        sufferingFrom: req.body.sufferfrom,
                        sex: req.body.gender,
                        age: req.body.age,
                        aadharVoterId: req.body.aadhar,
                        admissionType: req.body.admittype,
                        paymentType: req.body.paymenttype,
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
                        packageOffered: req.body.packageOffered,
                        packageAmount: req.body.packagetextarea,
                        packageAmount: req.body.packageAmount,
                        packageOfferedBy: req.body.packageOfferedBy,
                        modifiedBy: req.body.modifiedBy,
                        advanceAmount: req.body.advance,
                        dischargedBy: req.body.dischargedBy,
                        referer: req.body.referer,
                        refererPhone: req.body.refererPhone,
                        refererAmount: req.body.refererAmount
                    };
                    _.toUpper(req.body.isAdmitted) === "YES" ? updateData.isAdmitted = true : updateData.isAdmitted = false;
                    _.toUpper(req.body.isDischarged) === "YES" ? updateData.isDischarged = true : updateData.isDischarged = false;
                    result = updatePatient(updateData, { registrationid: req.body.regId });
                    if (result === 'success')
                        res.render('settings', { title: "Settings", memorySizes: getMemorySizes(req), message: "Patient updation successfull.", loggedInUser: global.loggedInUser });                        
                    else
                        res.render('failure', { title: "Something Wrong!", message: "Updataion Failed", loggedInUser: global.loggedInUser });        
                } else
                    res.render('failure', { title: "Something Wrong!", message: "Registration id is not valid", loggedInUser: global.loggedInUser });
            });
        } else if(req.body.deleteConf){
            Patient.findOneAndRemove({ "registrationid": req.body.ptRegIdToDelete }, function(err){
                if (err) return next(err);
                else {                    
                    new DeletedPatient({
                        registrationid: req.body.ptRegIdToDelete,
                        patientName: req.body.ptNameToDelete,
                        deleteDate: new Date().toLocaleString()
                    }).save(function(err, result){
                        if (err) throw err;
                        if (result) { 
                            res.render('settings', { title: "Settings", memorySizes: getMemorySizes(req), message: "Patient deleted successfully.", loggedInUser: global.loggedInUser });                           
                        };
                    });
                }
            });
        } else if(req.body.username){
            User.findOneAndUpdate({username: req.body.username}, {isBlocked: req.body.isBlocked}, {upsert:true}, function(err){
                if (err) return res.send(500, { error: err });
                res.status(200).send({statusCode: 200, message: "User doc updated sucessfully."});                                           
            });
        } else {
            var err = new Error('You have to fill at least one field.');
            err.status = 400;
            return next(err);
        }
    }
};
