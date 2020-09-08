const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PostUpvoteSchema = new Schema(
    {
        post:{type:Schema.Types.ObjectId, ref:'Post'},
        submitter: {type:Schema.Types.ObjectId, ref:'User'},
        date_created_at: {type: Date, default: Date.now},
    }
)

module.exports = mongoose.model('PostUpvote', PostUpvoteSchema);