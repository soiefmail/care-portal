var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var schema = new Schema({
    registrationid: {type: String, required: true, unique: true},
    patientname: {type: String, required: true},
    dueList: {type: Array, required: true},
    totalDue: {type: String, required: true},
    lastUpdated: { type : Date, default: Date.now },
    modifiedBy: {type: String, required: false}
});

module.exports = mongoose.model('Due', schema);