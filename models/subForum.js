const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SubForumSchema = new Schema(
    {
        name: {type: String, requried: true, minlength: 3},
        title: {type: String, required: true, maxlength: 50},
        description: {type: String, maxlength:500},
        sidebar:{type: String, maxlength: 10240},
        submission_text:{type: String, maxlength: 1024},
        moderators: [{type: Schema.Types.ObjectId, ref:'SubForumModerator'}],
        custom_submit_link_button:{type:String, maxlength:25, default: ''},
        custom_submit_text_button: {type:String, maxlength:25, default: ''},
    }
)

module.exports = mongoose.model('SubForum', SubForumSchema);