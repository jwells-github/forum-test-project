var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema(
    {
        username: {type: String, required: true, minlength: 3},
        password: {type:String, required: true},
        email: {type:String, required: true},
        joined_date: {type: Date, default: Date.now},
        email_is_verified: {type: Boolean, default: false},

    }
)

module.exports = mongoose.model('User', UserSchema);