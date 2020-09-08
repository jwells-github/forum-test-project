const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SubredditSchema = new Schema(
    {
        name: {type: String, requried: true, minlength: 3},
        title: {type: String, required: true, maxlength: 50},
        description: {type: String, maxlength:500},
        sidebar:{type: String, maxlength: 10240},
        submission_text:{type: String, maxlength: 1024},
        type: {type: String, enum:['public','restricted','private']},
        approved_users: [{type: Schema.Types.ObjectId, ref:'user'}],
        moderators: [{type: Schema.Types.ObjectId, ref:'User'}],
        content_options: {type:String, enum:['any','links-only','textposts-only']},
        custom_submit_link_button:{type:String, maxlength:25, default: ''},
        custom_submit_text_button: {type:String, maxlength:25, default: ''},
    }
)

module.exports = mongoose.model('Subreddit', SubredditSchema);