const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CommentUpvoteSchema = new Schema(
    {
        content:{type:Schema.Types.ObjectId, ref:'Comment', required: true},
        submitter: {type:Schema.Types.ObjectId, ref:'User', required: true},
        date_created_at: {type: Date, default: Date.now},
    }
)

module.exports = mongoose.model('CommentUpvote', CommentUpvoteSchema);