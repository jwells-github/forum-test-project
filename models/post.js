var mongoose = require('mongoose');
var Schema = mongoose.Schema;



var PostSchema = new Schema(
    {
        title: {type: String, required: true, maxlength: 50},
        text:{type:String, default:'', maxlength: 40000},
        link:{type:String, default:''},
        submitter: {type:Schema.Types.ObjectId, ref:'user'},
        subreddit: {type:Schema.Types.ObjectId, ref:'subreddit'},
        date_created_at: {type: Date, default: Date.now},
        edited: Boolean,
        date_last_edited: Date, 
    }
)

module.exports = mongoose.model('post', PostSchema);