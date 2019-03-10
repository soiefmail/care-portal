var Patient = require('../../models/patient'),
    Advance = require('../../models/advance'),
    Due = require('../../models/due'),
    Invoice = require('../../models/invoice'),
    _ = require('lodash'),
    addInvoice = require('../../seed/addInvoice'),
    updateInvoice = require('../../seed/updateInvoice'),
    updateDue = require('../../seed/updateDue'),
    addDue = require('../../seed/addDue');


// this function used to get modified array of objects without 'sl' key for invoice particularList
function getModifiedCollection(collection) {
    return _.map(collection, function(object) {
        return _.pick(object, ['particular', 'qty', 'amount']);
    });
}
module.exports = {
    get: function(req, res, next) {
        var regId = req.query.regid;
        if (regId) {
            Patient.findOne({ "registrationid": regId }, function(err, patientDocs) {
                if (err) return next(err);
                if (patientDocs) {
                    if (!patientDocs.invoiceDate) {
                        var date = new Date().toLocaleDateString();
                        patientDocs.invoiceDate = date;
                    }
                    Invoice.findOne({ "registrationid": regId }, function(err, invoiceDocs) {
                        if (err) return next(err);;
                        Advance.findOne({ "registrationid": regId }, function(err, advanceDocs) {
                            if (err) return next(err);;
                            res.render('invoice', { title: "Invoice", patientObj: patientDocs, invoiceDocs: invoiceDocs, advanceDocs: advanceDocs, print: true, loggedInUser: global.loggedInUser });
                        });
                    });
                } else
                    res.render('failure', { title: "Something Wrong!", message: "Registration id is not valid", loggedInUser: global.loggedInUser });
            });
        } else
            res.render('userinput', { title: "Fill Details", pageToRedirect: "invoice", message: "Please provide registration id below", btnName: "Generate Invoice", localRegId: localStorage.getItem('localRegId'), loggedInUser: global.loggedInUser });

    },
    post: function(req, res, next) {
        var invoiceObj = {
            regId: req.body.registrationid,
            invoiceDate: req.body.invoiceDate,
            patientname: req.body.patientname,
            paymenttype: req.body.paymenttype,
            particularsList: JSON.parse(req.body.particularsList),
            totalAmount: req.body.totalAmount,
            advanceAmount: req.body.advanceAmount,
            payableAmount: req.body.payableAmount,
            paidAmount: req.body.paidAmount,
            modifiedBy: global.loggedInUser,
            dueAmount: req.body.dueAmount
        };
        Invoice.find({ "registrationid": invoiceObj.regId }, function(err, docs) {
            if (err) return next(err);
            if (docs.length) {
                //prevent duplicate invoice insersion
                var reqInvoiceList = getModifiedCollection(invoiceObj.particularsList),
                    presents = false;

                _.each(docs, function(obj) {
                    var dbInvoiceList = getModifiedCollection(obj.particularsList),
                        diff1 = _.differenceWith(dbInvoiceList, reqInvoiceList, _.isEqual),
                        diff2 = _.differenceWith(reqInvoiceList, dbInvoiceList, _.isEqual);
                    if (!diff1.length && !diff2.length) {
                        presents = true;
                        return false;
                    };
                });
                if (presents)
                    res.status(500).send({ statusCode: 11000, message: "This invoice exists already.", loggedInUser: global.loggedInUser });
                else {
                    //res.status(500).send({ statusCode: 11000, message: "wait" });
                    Due.findOne({ "registrationid": invoiceObj.regId }, function(err, dueDocs) {
                        if (err) return next(err);
                        if(dueDocs.totalDue != 0) {
                            dueDocs.regId = dueDocs.registrationid;
                            dueDocs.onInvoice = true;
                            dueDocs.dueList[0].date = new Date().toLocaleString();
                            var totalDueAmount = Number(dueDocs.dueList[0].dueAmount) + Number(invoiceObj.dueAmount);
                            dueDocs.dueList[0].dueAmount = totalDueAmount;
                            dueDocs.lastUpdated = new Date();
                            updateDue(res, dueDocs);
                        }
                    });
                    updateInvoice(res, invoiceObj);
                }
            } else {
                var dueObj = {
                    regId: invoiceObj.regId,
                    patientname: invoiceObj.patientname,
                    dueList: [ { 
                        due: "Due left after bill payment",
                        date: new Date().toLocaleString(),
                        dueAmount: invoiceObj.dueAmount 
                    } ],
                    totalDue: invoiceObj.dueAmount,
                    modifiedBy: loggedInUser,
                    lastUpdated: new Date(),
                    onInvoice: true
                };
                addDue(res, dueObj);
                addInvoice(res, invoiceObj);
            }
        });
    }
};
