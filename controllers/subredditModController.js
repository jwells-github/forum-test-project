const { body,validationResult } = require('express-validator');
const { sanitizeBody } = require('express-validator');
const async = require("async");

const Subreddit = require('../models/subreddit');
const User = require('../models/user');
const SubredditModerator = require('../models/subreddit_moderator');

exports.mod_access_get = function(req,res,next){
  if(res.locals.currentUser){
    Subreddit.findOne({name: req.params.subredditName})
    .populate({
      path:'moderators',
        populate: {
          path: 'user'
        }
    })
    .exec(function(err,subreddit){
      if(err){return next(err);}
      if(!subreddit){
        let err = new Error('Subreddit not found');
        err.status = 404;
        return next(err);
      } 
      let mod = subreddit.moderators.find(moderator => String(moderator.user._id) === String(res.locals.currentUser._id));
      if(mod){
        res.render('mod_access',{title: subreddit.title, subreddit:subreddit, moderators: subreddit.moderators});
      }
      else{
        res.redirect('/');
      }
    })
  }
  else{
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
        subreddit:function(callback){
          Subreddit.findOne({name: req.params.subredditName})
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
        if(!results.subreddit){
          var err = new Error('Subreddit not found');
          err.status = 404;
          return next(err);
        }
        if(!results.user){
          var err = new Error('User not found');
          err.status = 404;
          return next(err);
        }
        let submitter_mod = results.subreddit.moderators.find(moderator => String(moderator.user._id) === String(res.locals.currentUser._id));
        if(!submitter_mod){
          var err = new Error('Invalid permissions');
          err.status = 404;
          return next(err);
        }
        // Check if the submitted user is already a moderator
        let mod_already_exists = results.subreddit.moderators.find(moderator => String(moderator.user._id) === String(results.user._id))
        if(mod_already_exists){
          var err = new Error('User is already a moderator');
          err.status = 404;
          return next(err);
        }
        var new_mod = new SubredditModerator({
          can_appoint: req.body.can_appoint ? true: false,
          subreddit: results.subreddit._id,
          can_ban: req.body.can_ban ? true: false,
          can_edit_sub_details: req.body.can_edit_sub_details ? true: false,
          can_remove: req.body.can_remove ? true: false,
          user: results.user._id,
        })
        new_mod.save(function(err){
          if(err){return next(err);}
          results.subreddit.moderators.push(new_mod._id);
          results.subreddit.save(function(err){
            if(err){return next(err);}
            return res.redirect('/r/'+results.subreddit.name+'/mod_access')
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

exports.removed_list_get = function(req,res,next){

}

exports.mod_permissions_post = (req,res,next) =>{
  console.log(req.body);
  if(res.locals.currentUser){
    async.parallel({
      subreddit: function(callback){
        Subreddit.findOne({name: req.params.subredditName})
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
      if(!results.subreddit){
        return res.status(404).send({error:'Subreddit not found'});
      }
      if(!results.user){
        return res.status(404).send({error:'User not found'});
      }
      let submitter_mod = results.subreddit.moderators.find(moderator => String(moderator.user._id) === String(res.locals.currentUser._id));
      if(!submitter_mod){
        return res.status(403).send({error:'You have invalid permissions'});
      }
      // Moderators must have the power to appoint moderators to change permissions
      if(!submitter_mod.can_appoint){
        return res.status(403).send({error:'You have invalid permissions'});
      }
      let updated_mod = results.subreddit.moderators.find(moderator => String(moderator.user._id) === String(results.user._id))
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