var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var schema = new Schema({
    registrationid: {type: String, required: true, unique: true},
    advanceList: {type: Array, required: true},
    totalAdvance: {type: String, required: true},
    modifiedBy: {type: String, required: false}
});

module.exports = mongoose.model('Advance', schema);