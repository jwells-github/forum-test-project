var mongoose = require('mongoose');
const { schema } = require('./post');
var Schema = mongoose.Schema;



var CommentSchema = new Schema(
    {
        post:{type:Schema.Types.ObjectId, ref:'post'},
        text:{type:String, requried:true, maxlength: 10000},
        submitter: {type:Schema.Types.ObjectId, ref:'user'},
        date_created_at: {type: Date, default: Date.now},
        edited: Boolean,
        date_last_edited: Date, 
    }
)

module.exports = mongoose.model('comment', CommentSchema);