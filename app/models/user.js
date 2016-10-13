// var db = require('../config');
var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var Promise = require('bluebird');


var userSchema = mongoose.Schema({
  username: {
    type: String,
    unique: true
  },
  password: String
});

userSchema.methods.comparePassword = function(attemptedPassword, callback) {
  bcrypt.compare(attemptedPassword, this.password, function(err, isMatch) {
    callback(isMatch);
  });
};

userSchema.methods.hashPassword = function() {
  var cipher = Promise.promisify(bcrypt.hash);
  return cipher(this.password, null, null).bind(this)
    .then(function(hash) {
      this.password = hash;
    });
};

userSchema.pre('save', function(next) {
  this.hashPassword()
  .then(function() {
    next();
  })
  .catch(function(err) {
    next(err);
  });
});

var User = mongoose.model('User', userSchema);

module.exports = User;
