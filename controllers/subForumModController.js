const { body,validationResult } = require('express-validator');
const { sanitizeBody } = require('express-validator');
const async = require("async");

const SubForum = require('../models/subForum');
const User = require('../models/user');
const SubForumBan = require('../models/subForum_ban');
const SubForumModerator = require('../models/subForum_moderator');
const Comment =  require('../models/comment');
const Post = require('../models/post');

exports.mod_access_get = function(req,res,next){
  if(res.locals.currentUser){
    async.parallel({
      subForum: function(callback){
        let matchRegex = new RegExp("("+req.params.subForumName+")\\b","i")
        SubForum.findOne({name:{$regex: matchRegex}})
        .populate({
          path:'moderators',
            populate: {
              path: 'user'
            }
        })
        .exec(callback);
      },
      banned_users: function(callback){
        SubForumBan.find({subForum_name: req.params.subForumName})
        .populate('banned_user')
        .exec(callback);
      }
    },function(err,results){
      if(err){return next(err);}
      let subForum = results.subForum;  
      if(!subForum){
        let err = new Error('SubForum not found');
        err.status = 404;
        return next(err);
      } 
      let mod = subForum.moderators.find(moderator => String(moderator.user._id) === String(res.locals.currentUser._id));
      if(mod){
        res.render('mod_access',{
          title: subForum.title, 
          subForum:subForum, 
          moderators: subForum.moderators,
          is_mod: true,
          banned_users: results.banned_users
        });
      }
      else{
        req.flash('info', 'You do not have permission to access that page')
        res.redirect('/');
      }
    })
  }
  else{
    req.flash('info', 'You do not have permission to access that page')
    res.redirect('/');
  }
}


exports.mod_access_post = [
  sanitizeBody('*').trim(),
  body('username').isLength({min:0}),
  (req,res,next) =>{
    if(res.locals.currentUser){
      // Prevent moderators without any permissions from being created
      if(!req.body.can_appoint && !req.body.can_ban && !req.body.can_edit_sub_details && !req.body.can_remove){
        var err = new Error('No mod permissions selected');
        err.status = 404;
        return next(err);
      }
      async.parallel({
        subForum:function(callback){
          let matchRegex = new RegExp("("+req.params.subForumName+")\\b","i")
          SubForum.findOne({name:{$regex: matchRegex}})
          .populate({
            path:'moderators',
              populate: {
                path: 'user'
              }
          })
          .exec(callback);
        },
        user: function(callback){
          User.findOne({username: req.body.username})
          .exec(callback);
        },
      }, function(err,results){
        if(err){return next(err);}
        if(!results.subForum){
          var err = new Error('SubForum not found');
          err.status = 404;
          return next(err);
        }
        if(!results.user){
          var err = new Error('User not found');
          err.status = 404;
          return next(err);
        }
        let submitter_mod = results.subForum.moderators.find(moderator => String(moderator.user._id) === String(res.locals.currentUser._id));
        if(!submitter_mod){
          var err = new Error('Invalid permissions');
          err.status = 404;
          return next(err);
        }
        // Check if the submitted user is already a moderator
        let mod_already_exists = results.subForum.moderators.find(moderator => String(moderator.user._id) === String(results.user._id))
        if(mod_already_exists){
          var err = new Error('User is already a moderator');
          err.status = 404;
          return next(err);
        }
        var new_mod = new SubForumModerator({
          can_appoint: req.body.can_appoint ? true: false,
          subForum: results.subForum._id,
          can_ban: req.body.can_ban ? true: false,
          can_edit_sub_details: req.body.can_edit_sub_details ? true: false,
          can_remove: req.body.can_remove ? true: false,
          user: results.user._id,
        })
        new_mod.save(function(err){
          if(err){return next(err);}
          results.subForum.moderators.push(new_mod._id);
          results.subForum.save(function(err){
            if(err){return next(err);}
            return res.redirect('/r/'+results.subForum.name+'/mod_access')
          })
        })
      })
    }
    else{
      var err = new Error('Invalid permissions');
      err.status = 404;
      return next(err);
    }
  }
]

exports.mod_access_ban = (req,res,next) =>{
  if(res.locals.currentUser){
    async.parallel({
      subForum: function(callback){
        let matchRegex = new RegExp("("+req.params.subForumName+")\\b","i")
        SubForum.findOne({name:{$regex: matchRegex}})
        .populate({
          path: 'moderators',
            populate: {
              path: 'user'
            }
        })
        .exec(callback);
      },
      user_to_ban: function(callback){
        User.findOne({username:req.params.username})
        .exec(callback);
      },
    }, function(err,results){
      if(err){return next(err);}
      if(!results.subForum){
        return res.status(404).send({error:'SubForum not found'});
      } 
      if(!results.user_to_ban){
        return res.status(404).send({error:'User not found'});
      }
      SubForumBan.findOne({banned_user: results.user_to_ban._id,subForum:results.subForum._id})
      .exec(function(err,banned_user){
        if(err){return next(err);}
        if(banned_user){
          return res.status(401).send({error:'User Already Banned'});
        }
        else{
          let mod = results.subForum.moderators.find(moderator => String(moderator.user._id) === String(res.locals.currentUser._id));
          if(mod){
            let user_to_ban_is_mod = results.subForum.moderators.find(moderator => String(moderator.user._id) === String(results.user_to_ban._id))
            if(user_to_ban_is_mod){
              return res.status(401).send({error:'Cannot ban a moderator'});
            }
            else{
              let subForum_ban = new SubForumBan({
                banned_user: results.user_to_ban._id,
                subForum: results.subForum._id,
                subForum_name: results.subForum.name
              })
              subForum_ban.save(function(err){
                if(err){return next(err);}
                return res.sendStatus(200);
              }) 
            }
          }
          else{
            return res.status(401).send({error:'Invalid Permissions'});
          } 
        }
      })
    })
  }
  else{
    return res.status(401).send({error:'Invalid Permissions'});
  }
}

exports.mod_access_unban = (req,res,next) =>{
  if(res.locals.currentUser){
    async.parallel({
      subForum: function(callback){
        let matchRegex = new RegExp("("+req.params.subForumName+")\\b","i")
        SubForum.findOne({name:{$regex: matchRegex}})
        .populate({
          path: 'moderators',
            populate: {
              path: 'user'
            }
        })
        .exec(callback);
      },
      user_to_unban: function(callback){
        User.findOne({username:req.params.username})
        .exec(callback);
      },
    }, function(err,results){
      if(err){return next(err);}
      if(!results.subForum){
        return res.status(404).send({error:'SubForum not found'});
      } 

      if(!results.user_to_unban){
        return res.status(404).send({error:'User not found'});
      }
      let mod = results.subForum.moderators.find(moderator => String(moderator.user._id) === String(res.locals.currentUser._id));
      if(mod){
        SubForumBan.deleteOne({subForum:results.subForum._id, banned_user: results.user_to_unban._id})
        .exec(function(err){
          if(err){return next(err);}
          return res.sendStatus(200);
        })
      }
      else{
        return res.status(401).send({error:'Invalid Permissions'});
      }
    })
  }
  else{
    return res.status(401).send({error:'Invalid Permissions'});
  }
}

exports.removed_list_get = function(req,res,next){
  if(res.locals.currentUser){
    let matchRegex = new RegExp("("+req.params.subForumName+")\\b","i")
    SubForum.findOne({name:{$regex: matchRegex}})
    .populate({
      path:'moderators',
        populate: {
          path: 'user'
        }
    })
    .exec(function(err,subForum){
      if(err){return next(err);}
      if(!subForum){
        let err = new Error('SubForum not found');
        err.status = 404;
        return next(err);
      } 
      let mod = subForum.moderators.find(moderator => String(moderator.user._id) === String(res.locals.currentUser._id));
      if(mod){
        async.parallel({
          removed_posts: function(callback){
            Post.find({subForum:subForum._id, is_removed: true})
            .populate('subForum')
            .limit(50)
            .exec(callback);
          },
          removed_comments: function(callback){
            Comment.find({subForum:subForum._id, is_removed: true})
            .populate({
              path:'post',
                populate: {
                  path:'subForum'
                }
            })
            .exec(callback);
          }
        },function(err,results){
          if(err){return next(err);}
          let removed_content = results.removed_posts.concat(results.removed_comments);
          removed_content.sort(function(a,b){ 
            return b.date_created_at - a.date_created_at;
          });
          res.render('subForum_removed_content', {title: subForum.name + ' Removed', removed_content: removed_content});
        })
      }
      else{
        req.flash('info', 'You do not have permission to access that page')
        res.redirect('/');
      }
    })
  }
  else{
    req.flash('info', 'You do not have permission to access that page')
    res.redirect('/');
  }
}

exports.mod_permissions_post = (req,res,next) =>{
  if(res.locals.currentUser){
    async.parallel({
      subForum: function(callback){
        let matchRegex = new RegExp("("+req.params.subForumName+")\\b","i")
        SubForum.findOne({name:{$regex: matchRegex}})
        .populate({
          path:'moderators',
            populate: {
              path: 'user'
            }
        })
        .exec(callback);
      },
      user: function(callback){
        User.findOne({username: req.body.mod_name})
        .exec(callback);
      }
    }, function(err,results){
      if(err){return next(err);}
      if(!results.subForum){
        return res.status(404).send({error:'SubForum not found'});
      }
      if(!results.user){
        return res.status(404).send({error:'User not found'});
      }
      let submitter_mod = results.subForum.moderators.find(moderator => String(moderator.user._id) === String(res.locals.currentUser._id));
      if(!submitter_mod){
        return res.status(403).send({error:'You have invalid permissions'});
      }
      // Moderators must have the power to appoint moderators to change permissions
      if(!submitter_mod.can_appoint){
        return res.status(403).send({error:'You have invalid permissions'});
      }
      let updated_mod = results.subForum.moderators.find(moderator => String(moderator.user._id) === String(results.user._id))
      if(!updated_mod){
        return res.status(403).send({error:'This User is not a moderator'});
      }
      // Prevent moderators from changing their own permissions
      if(String(updated_mod.user._id) === String(submitter_mod.user._id)){
        return res.status(403).send({error:'You may not change your own permissions'});
      }
      // Only the head moderator may change the permissions of a moderator who may appoint other moderators
      if(updated_mod.can_appoint){
        if(!submitter_mod.head_mod){
          return res.status(403).send({error:'You have invalid permissions'});
        }
      }
      updated_mod.can_appoint = req.body.can_appoint;
      updated_mod.can_ban = req.body.can_ban;
      updated_mod.can_edit_sub_details = req.body.can_edit_sub_details;
      updated_mod.can_remove = req.body.can_remove;
      updated_mod.save(function(err){
        if(err){return next(err);}
        return res.sendStatus(200);
      })
    })
  }
  else{
    return res.status(403).send({error:'You have invalid permissions'});
  }
}

exports.mod_remove = (req,res,next) =>{
  if(res.locals.currentUser){
    async.parallel({
      subForum: function(callback){
        let matchRegex = new RegExp("("+req.params.subForumName+")\\b","i")
        SubForum.findOne({name:{$regex: matchRegex}})
        .populate({
          path:'moderators',
            populate: {
              path: 'user'
            }
        })
        .exec(callback);
      },
      user: function(callback){
        console.log(req.params.username)
        User.findOne({username: req.params.username})
        .exec(callback);
      }
    }, function(err,results){
      if(err){return next(err);}
      if(!results.subForum){
        return res.status(404).send({error:'SubForum not found'});
      }
      if(!results.user){
        return res.status(404).send({error:'User not found'});
      }
      let submitter_mod = results.subForum.moderators.find(moderator => String(moderator.user._id) === String(res.locals.currentUser._id));
      if(!submitter_mod){
        return res.status(403).send({error:'You have invalid permissions'});
      }
      // Moderators must have the power to appoint moderators to change permissions
      if(!submitter_mod.can_appoint){
        return res.status(403).send({error:'You have invalid permissions'});
      }
      let updated_mod = results.subForum.moderators.find(moderator => String(moderator.user._id) === String(results.user._id))
      if(!updated_mod){
        return res.status(403).send({error:'This User is not a moderator'});
      }
      // Prevent moderators from changing their own permissions
      if(String(updated_mod.user._id) === String(submitter_mod.user._id)){
        return res.status(403).send({error:'You may not change your own permissions'});
      }
      // Only the head moderator may change the permissions of a moderator who may appoint other moderators
      if(updated_mod.can_appoint){
        if(!submitter_mod.head_mod){
          return res.status(403).send({error:'You have invalid permissions'});
        }
      } 
      SubForumModerator.deleteOne({user:results.user._id}).exec(function(err){
        if(err){return next(err);}
        return res.sendStatus(200);
      })
    })
  }
  else{
    return res.status(403).send({error:'You have invalid permissions'});
  }
}
