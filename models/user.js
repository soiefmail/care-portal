var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

var UserSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
  },
  passwordConf: {
    type: String,
    required: true,
  },
  isBlocked: {
    type: Boolean,
    required: false,
  }
});

//authenticate input against database
UserSchema.statics.authenticate = function (username, password, callback) {
    User.findOne({ username: username })
        .exec(function (err, user) {
            if (err) {
                return callback(err)
            } else if (!user) {
                var err = new Error('User not found.');
                err.status = 401;
                return callback(err);
            }
            bcrypt.compare(password, user.password, function (err, result) {
                if (result === true && !user.isBlocked) {
                return callback(null, user);
                } else {
                return callback();
                }
            })
        });
    };

//hashing a password before saving it to the database
UserSchema.pre('save', function (next) {
    var user = this;
    bcrypt.hash(user.password, 10, function (err, hash){
      if (err) {
        return next(err);
      }
      user.password = hash;
        bcrypt.hash(user.passwordConf, 10, function (err, hash){
            if (err) {
                return next(err);
            }
            user.passwordConf = hash;
            next();
        });
    });    
});

var User = mongoose.model('User', UserSchema);
module.exports = User;