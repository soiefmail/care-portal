var Invoice = require('../models/invoice');

module.exports = function (res, invoiceObj) {
    new Invoice({
        registrationid: invoiceObj.regId,
        invoiceDate: invoiceObj.invoiceDate,
        patientName: invoiceObj.patientname,
        paymentType: invoiceObj.paymenttype,
        particularsList: invoiceObj.particularsList,
        totalAmount: invoiceObj.totalAmount,
        advanceAmount: invoiceObj.advanceAmount,
        payableAmount: invoiceObj.payableAmount,
        paidAmount: invoiceObj.paidAmount,
        modifiedBy: invoiceObj.modifiedBy,
        dueAmount: invoiceObj.dueAmount
    }).save(function(err, result){
        if (err){
            res.status(500).send({statusCode: 500, message: "Something went wrong in saving your invoice."});                                             
        }
        if (result) { 
            res.status(200).send({statusCode: 200, message: "Invoice saved sucessfully."});
        };
    });
};
