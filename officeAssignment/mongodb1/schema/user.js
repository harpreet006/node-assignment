var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var userSchema = new Schema({  	  
  	name: {
        type:String,
        required: true,
        unique: true
    },
  	password: String
});
var User = mongoose.model('Register', userSchema);
module.exports = User;