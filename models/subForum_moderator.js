const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SubForumModeratorSchema = new Schema(
    {
        user: {type:Schema.Types.ObjectId, ref:'User'},
        subForum: {type:Schema.Types.ObjectId, ref:'SubForum'},
        head_mod: {type: Boolean, default: false},
        appointment_date: {type: Date, default: Date.now},
        can_appoint: {type: Boolean, default: false},
        can_ban: {type:Boolean,default:false},
        can_edit_sub_details: {type:Boolean, default:false},
        can_remove: {type:Boolean, default:false},
    }
)

module.exports = mongoose.model('SubForumModerator', SubForumModeratorSchema);