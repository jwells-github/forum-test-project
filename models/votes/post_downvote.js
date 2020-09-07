var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PostDownvoteSchema = new Schema(
    {
        post:{type:Schema.Types.ObjectId, ref:'Post'},
        submitter: {type:Schema.Types.ObjectId, ref:'User'},
        date_created_at: {type: Date, default: Date.now},
    }
)

module.exports = mongoose.model('PostDownvote', PostDownvoteSchema);