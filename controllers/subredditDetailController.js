const { body,validationResult } = require('express-validator');
const { sanitizeBody } = require('express-validator');
const async = require("async");

const Subreddit = require('../models/subreddit');
const Post = require('../models/post');
const PostUpvote = require("../models/votes/post_upvote");
const PostDownvote = require("../models/votes/post_downvote");
const getUserVotes = require('../public/javascripts/getUserVotes.js');

exports.subreddit_get = function(req,res,next){
  Subreddit.findOne({name: req.params.subredditName})
  .populate('moderators')
  .exec(function(err,subreddit){
    if(err){return next(err);}
    if(!subreddit){
      var err = new Error('Subreddit not found');
      err.status = 404;
      return next(err);
    }
    async.parallel({
      posts:function(callback){
        Post.find({subreddit:subreddit._id})
        .populate('subreddit')
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
      res.render('subreddit_detail', {title: subreddit.title, subreddit:subreddit, posts:posts})
    })
  })
}

exports.subreddit_text_form_get = function(req,res,next){
  if(res.locals.currentUser){
    Subreddit.findOne({name: req.params.subredditName})
    .exec(function(err,subreddit){
      if(err){return next(err);}
      if(!subreddit){
        var err = new Error('Subreddit not found');
        err.status = 404;
        return next(err);
      }
      else{
        res.render('subreddit_text_post_create', {title: subreddit.title, subreddit:subreddit});
      }
    });
  }
  else{
    res.redirect('/');
  }
}

exports.subreddit_link_form_get = function(req,res,next){
  if(res.locals.currentUser){
    Subreddit.findOne({name: req.params.subredditName})
    .exec(function(err,subreddit){
      if(err){return next(err);}
      if(!subreddit){
        var err = new Error('Subreddit not found');
        err.status = 404;
        return next(err);
      }
      else{
        res.render('subreddit_link_post_create', {title: subreddit.title, subreddit:subreddit});
      }
    });
  }
  else{
    res.redirect('/');
  }
}

exports.subreddit_post =[
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
        res.render('subreddit_link_post_create', {title: 'Submit a post', errors: errors.array(), post: req.body});
      }
      else{
        console.log('going to text post')
        res.render('subreddit_text_post_create', {title: 'Submit a post', errors: errors.array(), subreddit: req.body});
      }
      return; 
    }
    else{
      Subreddit.findOne({name: req.params.subredditName})
      .exec(function(err,subreddit){
        if(err){return next(err);}
        if(!subreddit){
          var err = new Error('Subreddit not found');
          err.status = 404;
          return next(err);
        }
        else{
          var post = new Post({
            title: req.body.title,
            text: req.body.text,
            link: req.body.link,
            submitter: res.locals.currentUser,
            subreddit: subreddit._id,
          });
          post.save(function(err){
            if(err){return next(err);}
            return res.redirect('/r/'+subreddit.name+'/'+post._id);
          })
        }
      });

    }
  }
]

