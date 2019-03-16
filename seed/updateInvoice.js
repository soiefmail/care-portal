var Invoice = require('../models/invoice');

module.exports = function (res, invoiceObj) {
    var updateData = {
        invoiceDate: invoiceObj.invoiceDate,
        particularsList: invoiceObj.particularsList,
        totalAmount: invoiceObj.totalAmount,
        advanceAmount: invoiceObj.advanceAmount,
        payableAmount: invoiceObj.payableAmount,
        paidAmount: invoiceObj.paidAmount,
        dueAmount: invoiceObj.dueAmount
    };
    Invoice.findOneAndUpdate({ registrationid: invoiceObj.regId }, updateData, {upsert:true}, function(err, doc){
        if (err)
            res.status(500).send({statusCode: 500, message: "Something went wrong in updating your invoice."});                                           
        else
            res.status(200).send({statusCode: 200, message: "Invoice updated sucessfully."});                                           
    });
};
