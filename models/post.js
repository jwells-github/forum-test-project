const mongoose = require('mongoose');
const getAge = require('../public/javascripts/getAge.js');
const Schema = mongoose.Schema;

const PostSchema = new Schema(
    {
        title: {type: String, required: true, maxlength: 50},
        text:{type:String, default:'', maxlength: 40000},
        link:{type:String, default:''},
        submitter: {type:Schema.Types.ObjectId, ref:'User'},
        subreddit: {type:Schema.Types.ObjectId, ref:'Subreddit'},
        number_of_comments: {type: Number, default: 0},
        date_created_at: {type: Date, default: Date.now},
        upvote_count: {type:Number, default:0},
        downvote_count: {type:Number, default:0},
        is_deleted: {type:Boolean, default:false},
        is_edited: {type:Boolean, default:false},
        is_removed: {type:Boolean, default:false},
        date_last_edited: Date, 
    }
)

PostSchema.virtual('vote_score').get(function(){
    return this.upvote_count - this.downvote_count;
});

PostSchema.virtual('submission_age').get(function(){
    return getAge(this.date_created_at);
});

module.exports = mongoose.model('Post', PostSchema);