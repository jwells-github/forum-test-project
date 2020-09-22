const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PostDownvoteSchema = new Schema(
    {
        content:{type:Schema.Types.ObjectId, ref:'Post',required: true},
        submitter: {type:Schema.Types.ObjectId, ref:'User',required: true},
        date_created_at: {type: Date, default: Date.now},
    }
)

module.exports = mongoose.model('PostDownvote', PostDownvoteSchema);