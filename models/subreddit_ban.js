const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SubredditBanSchema = new Schema(
    {
        banned_user: {type:Schema.Types.ObjectId, ref:'User'},
        subreddit:{type:Schema.Types.ObjectId,ref:'Subreddit'},
        subreddit_name: String,
        ban_date: {type: Date, default: Date.now},
    }
)

module.exports = mongoose.model('SubredditBan', SubredditBanSchema);