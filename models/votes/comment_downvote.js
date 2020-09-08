const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CommentDownvoteSchema = new Schema(
    {
        comment:{type:Schema.Types.ObjectId, ref:'Comment'},
        submitter: {type:Schema.Types.ObjectId, ref:'User'},
        date_created_at: {type: Date, default: Date.now},
    }
)

module.exports = mongoose.model('CommentDownvote', CommentDownvoteSchema);