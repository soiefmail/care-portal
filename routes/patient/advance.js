var Patient = require('../../models/patient'),
    Advance = require('../../models/advance'),
    addAdvance = require('../../seed/addAdvance'),
    _ = require('lodash'),
    updateAdvance = require('../../seed/updateAdvance');

module.exports = {
    get: function(req, res, next) {
        var regId = req.query.regid;
        if (regId) {
            Patient.findOne({ "registrationid": regId }, function(err, patientDocs) {
                if (err) return next(err);
                if (patientDocs) {
                    Advance.findOne({ "registrationid": regId }, function(err, advanceDocs) {
                        if (err) return next(err);;
                        res.render('advance', { title: "Advance", patientObj: patientDocs, advanceDocs: advanceDocs, print: true, loggedInUser: global.loggedInUser });
                    });
                } else
                    res.render('failure', { title: "Something Wrong!", message: "Registration id is not valid", loggedInUser: global.loggedInUser });
            });
        } else
            res.render('userinput', { title: "Fill Details", pageToRedirect: "advance", message: "Please provide registration id below", btnName: "Check Advance Amount", localRegId: localStorage.getItem('localRegId'), loggedInUser: global.loggedInUser });

    },
    post: function(req, res, next) {
        var advanceObj = {
            regId: req.body.registrationid,
            advanceList: JSON.parse(req.body.advanceList),
            totalAdvance: req.body.totalAdvance
        };
        Advance.find({ "registrationid": advanceObj.regId }, function(err, docs) {
            if (err) return next(err);
            if (docs.length) {
                //prevent duplicate advance insersion
                var reqAdvanceList = advanceObj.advanceList,
                    presents = false;

                _.each(docs, function(obj) {
                    var dbAdvanceList = obj.advanceList,
                        diff1 = _.differenceWith(dbAdvanceList, reqAdvanceList, _.isEqual),
                        diff2 = _.differenceWith(reqAdvanceList, dbAdvanceList, _.isEqual);
                    if (!diff1.length && !diff2.length) {
                        presents = true;
                        return false;
                    };
                });
                if (presents)
                    res.status(500).send({ statusCode: 11000, message: "This advance exists already.", loggedInUser: global.loggedInUser });
                else {
                    updateAdvance(res, advanceObj);
                }
            } else {
                advanceObj.modifiedBy = loggedInUser;
                addAdvance(res, advanceObj);
            }
        });
    }
};
