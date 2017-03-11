var mongoose = require('mongoose');

var user = mongoose.model('User',{
  email:String,
  name:String,
  password:String,
  history:Array
});

module.exports = user;
