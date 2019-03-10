var Invoice = require('../../models/invoice'),
    _ = require('lodash');

module.exports = {
    get: function(req, res, next) {
        res.render('getpaymentdetails', { title: "Payment Details", loggedInUser: global.loggedInUser });
    },
    post: function(req, res, next) {
        var startdate = new Date(req.body.startpaydate),
            endDate = new Date(req.body.endpaydate),
            allPayArrCash = [],
            allPayArrCard = [],
            allPayArrOther = [],
            totalCash = 0,
            totalCard = 0,
            totalOther = 0;
        startdate.setHours(0,0,0,0);
        endDate.setHours(0,0,0,0);
        Invoice.find({}, function(err, docs) {
            if (err) return next(err);
            if (docs) {
                _.each(docs, function(obj) {
                    var invoiceDate = new Date(obj.invoiceDate);
                    invoiceDate.setHours(0,0,0,0);
                    /* if (invoiceDate.getFullYear() >= startdate.getFullYear() && invoiceDate.getFullYear() <= endDate.getFullYear() &&
                        invoiceDate.getMonth() >= startdate.getMonth() && invoiceDate.getMonth() <= endDate.getMonth() &&
                        invoiceDate.getDate() >= startdate.getDate() && invoiceDate.getDate() <= endDate.getDate()) { */
                    if(invoiceDate >= startdate && invoiceDate <= endDate) {
                        obj.invoiceDate = invoiceDate.toLocaleDateString();
                        if (obj.paymentType == "Cash") {
                            totalCash += Number(obj.paidAmount);
                            allPayArrCash.push(obj);
                        } else if (obj.paymentType == "Card") {
                            totalCard += Number(obj.paidAmount);
                            allPayArrCard.push(obj);
                        } else {
                            totalOther += Number(obj.paidAmount);
                            allPayArrOther.push(obj);
                        }
                    }
                });
                res.render('getpaymentdetails', { title: "Payment Details", allPayArrCash: allPayArrCash, totalCash: totalCash, allPayArrCard: allPayArrCard, totalCard: totalCard, allPayArrOther: allPayArrOther, totalOther: totalOther, loggedInUser: global.loggedInUser });
            } else {
                res.render('failure', { title: "Something Wrong!", message: "Invoice db not exist", loggedInUser: global.loggedInUser });
            }
        });
    }
};
