var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var schema = new Schema({
    registrationid: {type: String, required: true, unique: true},
    patientName: {type: String, required: true},
    paymentType: {type: String, required: true},
    invoiceDate: {type: String, required: true},
    particularsList: {type: Array, required: true},
    totalAmount: {type: String, required: true},
    advanceAmount: {type: String, required: false},
    payableAmount: {type: String, required: true},
    paidAmount: {type: String, required: false},
    dueAmount: {type: String, required: false},
    modifiedBy: {type: String, required: false}
});

module.exports = mongoose.model('Invoice', schema);