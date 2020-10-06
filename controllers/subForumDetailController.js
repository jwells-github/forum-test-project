const { body,validationResult } = require('express-validator');
const { sanitizeBody } = require('express-validator');
const async = require("async");

const SubForum = require('../models/subForum');
const Post = require('../models/post');
const PostUpvote = require("../models/votes/post_upvote");
const PostDownvote = require("../models/votes/post_downvote");
const getUserVotes = require('../public/javascripts/getUserVotes.js');

exports.subForum_get = function(req,res,next){
  let now = new Date(Date.now())
  let one_day_ago = new Date()
  one_day_ago.setHours(now.getHours()-24)
  let two_days_ago = new Date()
  two_days_ago.setHours(now.getHours()-(24*2))
  let one_week_ago = new Date();
  one_week_ago.setHours(now.getHours()-(24*7));

  let matchRegex = new RegExp("("+req.params.subForumName+")\\b","i")
  SubForum.findOne({name: {$regex: matchRegex}})
  .populate({
    path: 'moderators',
      populate: {
        path: 'user'
      }
  })
  .exec(function(err,subForum){
    if(err){return next(err);}
    if(!subForum){
      var err = new Error('SubForum not found');
      err.status = 404;
      return next(err);
    }
    async.parallel({
      todays_posts: function(callback){
        Post.find({subForum: subForum._id, date_created_at: {$gte: one_day_ago}})
        .sort({upvote_count :-1})
        .populate('subForum')
        .limit(50)
        .exec(callback)
      },
      yesterdays_posts: function(callback){
        Post.find({subForum: subForum._id, date_created_at: {$gte: two_days_ago, $lt: one_day_ago}})
        .sort({upvote_count :-1})
        .populate('subForum')
        .limit(50)
        .exec(callback)
      },
      last_weeks_posts: function(callback){
        Post.find({subForum: subForum._id, date_created_at: {$gte: one_week_ago, $lt: two_days_ago}})
        .sort({upvote_count :-1})
        .populate('subForum')
        .limit(50)
        .exec(callback)
      },
      older_posts: function(callback){
        Post.find({subForum: subForum._id, date_created_at: {$lt: one_week_ago}})
        .sort({upvote_count :-1})
        .populate('subForum')
        .limit(50)
        .exec(callback)
      },
      post_upvotes: function(callback){
        if(res.locals.currentUser){
          PostUpvote.find({submitter:res.locals.currentUser._id})
          .exec(callback);
        }
        else{callback(null,[])}
      },
      post_downvotes: function(callback){
        if(res.locals.currentUser){
          PostDownvote.find({submitter:res.locals.currentUser._id})
          .exec(callback);
        }
        else{callback(null,[])}
      }
    }, function(err,results){
      if(err){return next(err);}
      let posts = results.todays_posts.concat(results.yesterdays_posts,results.last_weeks_posts,results.older_posts);
      if(res.locals.currentUser){
        posts = getUserVotes(posts, results.post_upvotes, results.post_downvotes);
      }
      let is_mod = false;
      if(res.locals.currentUser){
        let mod = subForum.moderators.find(moderator => String(moderator.user._id) === String(res.locals.currentUser._id));
        if(mod){
          is_mod = true;
        }
      }
      res.render('subForum_detail', {title: subForum.title, is_mod:is_mod, subForum:subForum, posts:posts, flash_messages: req.flash('info')})
    })
  })
}

exports.subForum_sorted_get = function(req,res,next){
  let matchRegex = new RegExp("("+req.params.subForumName+")\\b","i")
  SubForum.findOne({name: {$regex: matchRegex}})
  .populate({
    path: 'moderators',
      populate: {
        path: 'user'
      }
  })
  .exec(function(err,subForum){
    if(err){return next(err);}
    if(!subForum){
      var err = new Error('SubForum not found');
      err.status = 404;
      return next(err);
    }
    async.parallel({
      posts:function(callback){
        let sortParam = {}
        if(req.route.path ==='/:subForumName/new'){
          sortParam = {date_created_at:-1};
        }
        else if(req.route.path === '/:subForumName/top'){
          sortParam = {upvote_count:-1};
        }
        Post.find({subForum:subForum._id})
        .populate('subForum')
        .sort(sortParam)
        .limit(50)
        .exec(callback)
      },
      post_upvotes: function(callback){
        if(res.locals.currentUser){
          PostUpvote.find({submitter:res.locals.currentUser._id})
          .exec(callback);
        }
        else{callback(null,[])}
      },
      post_downvotes: function(callback){
        if(res.locals.currentUser){
          PostDownvote.find({submitter:res.locals.currentUser._id})
          .exec(callback);
        }
        else{callback(null,[])}
      }
    }, function(err,results){
      if(err){return next(err);}
      let posts = results.posts;
      if(res.locals.currentUser){
        posts = getUserVotes(results.posts, results.post_upvotes, results.post_downvotes);
      }
      let is_mod = false;
      if(res.locals.currentUser){
        let mod = subForum.moderators.find(moderator => String(moderator.user._id) === String(res.locals.currentUser._id));
        if(mod){
          is_mod = true;
        }
      }
      res.render('subForum_detail', {title: subForum.title, is_mod:is_mod, subForum:subForum, posts:posts})
    })
  })
}


exports.subForum_text_form_get = function(req,res,next){
  if(res.locals.currentUser){
    let matchRegex = new RegExp("("+req.params.subForumName+")\\b","i")
    SubForum.findOne({name: {$regex: matchRegex}})
    .exec(function(err,subForum){
      if(err){return next(err);}
      if(!subForum){
        var err = new Error('SubForum not found');
        err.status = 404;
        return next(err);
      }
      else{
        res.render('subForum_text_post_create', {title: subForum.title, subForum:subForum});
      }
    });
  }
  else{
    req.flash('info', 'You must have an account in order to make a submission!');
    res.redirect('/signup');
  }
}

exports.subForum_link_form_get = function(req,res,next){
  if(res.locals.currentUser){
    let matchRegex = new RegExp("("+req.params.subForumName+")\\b","i")
    SubForum.findOne({name:{$regex: matchRegex}})
    .exec(function(err,subForum){
      if(err){return next(err);}
      if(!subForum){
        var err = new Error('SubForum not found');
        err.status = 404;
        return next(err);
      }
      else{
        res.render('subForum_link_post_create', {title: subForum.title, subForum:subForum});
      }
    });
  }
  else{
    req.flash('info', 'You must have an account in order to make a submission!')
    res.redirect('/signup');
  }
}

exports.subForum_post =[
  sanitizeBody('*').trim(),
  body('title', 'Posts require a title').escape().isLength({min:1}),
  body('link', 'Please enter a valid url').custom(value =>{
    if(/\b(https?):\/\/[\-A-Za-z0-9+&@#\/%?=~_|!:,.;]*[\-A-Za-z0-9+&@#\/%=~_|]/.test(value)){
      return true;
    }
    if(value === undefined){
      return true
    }
    throw new Error('Invalid URL')
  }),
  body('text').isLength({max: 40000}),

  (req,res,next) =>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
      console.log(errors);
      if(req.body.link){
        console.log('going to link post')
        res.render('subForum_link_post_create', {title: 'Submit a post', errors: errors.array(), post: req.body});
      }
      else{
        console.log('going to text post')
        res.render('subForum_text_post_create', {title: 'Submit a post', errors: errors.array(), subForum: req.body});
      }
      return; 
    }
    else{
      let matchRegex = new RegExp("("+req.params.subForumName+")\\b","i")
      SubForum.findOne({name:{$regex: matchRegex}})
      .exec(function(err,subForum){
        if(err){return next(err);}
        if(!subForum){
          var err = new Error('SubForum not found');
          err.status = 404;
          return next(err);
        }
        else{
          var post = new Post({
            title: req.body.title,
            text: req.body.text,
            link: req.body.link,
            submitter: res.locals.currentUser,
            subForum: subForum._id,
          });
          post.save(function(err){
            if(err){return next(err);}
            req.flash('info', 'Post Created!')
            return res.redirect('/r/'+subForum.name+'/'+post._id);
          })
        }
      });

    }
  }
]

exports.subForum_edit_details_get = function(req,res,next){
  if(res.locals.currentUser){
    let matchRegex = new RegExp("("+req.params.subForumName+")\\b","i")
    SubForum.findOne({name: {$regex: matchRegex}})
    .populate({
      path:'moderators',
        populate: {
          path: 'user'
        }
    })
    .exec(function(err,subForum){
      if(err){return next(err);}
      if(!subForum){
        var err = new Error('SubForum not found');
        err.status = 404;
        return next(err);
      }
      let mod = subForum.moderators.find(moderator => String(moderator.user._id) === String(res.locals.currentUser._id));
      if(mod){
        if(mod.can_edit_sub_details){
          console.log(mod.can_edit_sub_details)
          res.render('subForum_edit_form', {title: 'Edit ' + subForum.name, is_mod: true, subForum: subForum});
        }
        else{
          req.flash('info', 'You do not have permission to edit this subforum')
          res.redirect('/r/'+subForum.name);
        }
      }
      else{
        req.flash('info', 'You do not have permission to edit this subforum')
        res.redirect('/r/'+subForum.name);
      }
    })
  }
  else{
    req.flash('info', 'You do not have permission to edit this subforum')
    res.redirect('/r/'+req.params.subForumName);
  }
}

exports.subForum_edit_details_post = [
  sanitizeBody('*').trim(),
  body('title', 'titles must be less than 50 characters').isLength({max:50}),
  body('description', 'descriptions must be less than 50 characters').isLength({max:500}),
  body('sidebar','sidebar must be less than 10240 characters').isLength({max:10240}),
  body('submission_text', 'submission text must be less than 1024 characters').isLength({max:1024}),
  body('custom_submit_link_button', 'custom submit link button must be less than 25 characters').isLength({max:25}),
  body('custom_submit_text_button', 'custom submit text  button must be less than 25 characters').isLength({max:25}),
  (req,res,next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
      res.render('subForum_edit_form', {title: 'Edit ' + req.body.name, errors: errors.array(), subForum: req.body});
      return;
    }
    else{
      let matchRegex = new RegExp("("+req.params.subForumName+")\\b","i")
      SubForum.findOne({name: {$regex: matchRegex}})
      .populate({
        path:'moderators',
          populate: {
            path: 'user'
          }
      })
      .exec(function(err,subForum){
        if(err){return next(err);}
        if(!subForum){
          var err = new Error('SubForum not found');
          err.status = 404;
          return next(err);
        }
        let mod = subForum.moderators.find(moderator => String(moderator.user._id) === String(res.locals.currentUser._id));
        if(mod){
          if(mod.can_edit_sub_details){
            subForum.title = req.body.title;
            subForum.description = req.body.description;
            subForum.sidebar = req.body.sidebar;
            subForum.submission_text = req.body.submission_text;
            subForum.custom_submit_link_button = req.body.custom_submit_link_button;
            subForum.custom_submit_text_button = req.body.custom_submit_text_button;
            subForum.save(function(err){
              if(err){return next(err);}
              req.flash('info', 'SubForum details changed successfully!')
              res.redirect('/r/'+subForum.name)
            })
          }
          else{
            var err = new Error('invalid permissions not found');
            err.status = 403;
            return next(err);
          }
        }
        else{
          var err = new Error('invalid permissions not found');
          err.status = 403;
          return next(err);
        }
      })
    }
  }
]
