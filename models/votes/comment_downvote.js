var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CommentDownvoteSchema = new Schema(
    {
        comment:{type:Schema.Types.ObjectId, ref:'Comment'},
        submitter: {type:Schema.Types.ObjectId, ref:'User'},
        date_created_at: {type: Date, default: Date.now},
    }
)

module.exports = mongoose.model('CommentDownvote', CommentDownvoteSchema);