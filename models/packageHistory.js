var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var schema = new Schema({
    registrationId: {type: String, required: true, unique: false},
    packageTextarea: {type: String, required: false},
    packageAmount: {type: Number, required: false},
    packageOfferedBy: {type: String, required: false},
    packageOfferedDate: {type: String, required: false}
});

module.exports = mongoose.model('PackageHistory', schema);