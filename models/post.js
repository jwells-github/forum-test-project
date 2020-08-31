var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PostSchema = new Schema(
    {
        title: {type: String, required: true, maxlength: 50},
        text:{type:String, default:'', maxlength: 40000},
        link:{type:String, default:''},
        submitter: {type:Schema.Types.ObjectId, ref:'user'},
        subreddit: {type:Schema.Types.ObjectId, ref:'subreddit'},
        number_of_comments: {type: Number, default: 0},
        date_created_at: {type: Date, default: Date.now},
        upvote_count: {type:Number, default:0},
        downvote_count: {type:Number, default:0},
        is_deleted: {type:Boolean, default:false},
        is_edited: {type:Boolean, default:false},
        date_last_edited: Date, 
    }
)

module.exports = mongoose.model('post', PostSchema);