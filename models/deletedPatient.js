var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var schema = new Schema({
    registrationid: {type: String, required: true, unique: true},
    patientName: {type: String, required: true},
    deleteDate: {type: String, unique: true}
});

module.exports = mongoose.model('DeletedPatient', schema);