var Patient = require('../../models/patient'),
    Due = require('../../models/due'),
    Invoice = require('../../models/invoice'),
    updateDue = require('../../seed/updateDue'),
    _ = require('lodash'),
    addDue = require('../../seed/addDue');

module.exports = {
    get: function(req, res, next) {
        var regId = req.query.regid;
        if (regId) {
            Patient.findOne({ "registrationid": regId }, function(err, patientDocs) {
                if (err) return next(err);
                if (patientDocs) {
                    Due.findOne({ "registrationid": regId }, function(err, dueDocs) {
                        if (err) return next(err);
                        Invoice.findOne({ "registrationid": regId }, function(err, invoiceDocs) {
                            if (err) return next(err);
                            res.render('due', { title: "Due", patientObj: patientDocs, dueDocs: dueDocs, invoiceDocs: invoiceDocs, print: true, loggedInUser: global.loggedInUser });
                        });
                    });
                } else
                    res.render('failure', { title: "Something Wrong!", message: "Registration id is not valid", loggedInUser: global.loggedInUser });
            });
        } else
            res.render('userinput', { title: "Fill Details", pageToRedirect: "due", message: "Please provide registration id below", btnName: "Check Dues", localRegId: localStorage.getItem('localRegId'), loggedInUser: global.loggedInUser });

    },
    post: function(req, res, next) {
        var dueObj = {
            regId: req.body.registrationid,
            patientname: req.body.patientname,
            dueList: JSON.parse(req.body.dueList),
            totalDue: req.body.totalDue
        };
        if (dueObj.totalDue == '0') {
            res.status(500).send({ statusCode: 500, message: "No Dues Left." });
        } else {
            Due.find({ "registrationid": dueObj.regId }, function(err, docs) {
                if (err) return next(err);
                if (docs.length) {
                    //prevent duplicate due insersion
                    var reqDueList = dueObj.dueList,
                        presents = false;

                    _.each(docs, function(obj) {
                        var dbDueList = obj.dueList,
                            diff1 = _.differenceWith(dbDueList, reqDueList, _.isEqual),
                            diff2 = _.differenceWith(reqDueList, dbDueList, _.isEqual);
                        if (!diff1.length && !diff2.length) {
                            presents = true;
                            return false;
                        };
                    });
                    if (presents)
                        res.status(500).send({ statusCode: 11000, message: "This due exists already.", loggedInUser: global.loggedInUser });
                    else {
                        dueObj.lastUpdated = new Date();
                        updateDue(res, dueObj);
                    }
                } else {
                    dueObj.modifiedBy = loggedInUser;
                    dueObj.lastUpdated = new Date();
                    addDue(res, dueObj);
                }
            });
        }

    }
};
