const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SubForumBanSchema = new Schema(
    {
        banned_user: {type:Schema.Types.ObjectId, ref:'User'},
        subForum:{type:Schema.Types.ObjectId,ref:'SubForum'},
        subForum_name: String,
        ban_date: {type: Date, default: Date.now},
    }
)

module.exports = mongoose.model('SubForumBan', SubForumBanSchema);