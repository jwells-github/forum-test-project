const mongoose = require('mongoose');
const Schema = mongoose.Schema;



const CommentSchema = new Schema(
    {
        post:{type:Schema.Types.ObjectId, ref:'Post'},
        text:{type:String, requried:true, maxlength: 10000},
        submitter: {type:Schema.Types.ObjectId, ref:'User'},
        date_created_at: {type: Date, default: Date.now},
        is_sub_comment: {type:Boolean, default: false},
        sub_comments: [{type:Schema.Types.ObjectId, ref:'Comment'}],
        upvote_count: {type:Number, default:0},
        downvote_count: {type:Number, default:0},
        is_deleted: {type:Boolean, default:false},
        is_edited: {type:Boolean, default:false},
        date_last_edited: Date, 
    }
)

module.exports = mongoose.model('Comment', CommentSchema);