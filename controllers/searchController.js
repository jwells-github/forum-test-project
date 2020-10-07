const {body} = require('express-validator');
const SubForum = require('../models/subForum');
const async = require("async");

const Post = require('../models/post');
const PostUpvote = require("../models/votes/post_upvote");
const PostDownvote = require("../models/votes/post_downvote");
const getUserVotes = require('../public/javascripts/getUserVotes.js');

exports.subForum_search_get = function(req,res){
  let matchRegex = new RegExp("("+req.query.searchterm+")","i");
  SubForum.find(
    { $or:[
        {name:{$regex: matchRegex}}, 
        {description:{$regex: matchRegex}}, 
        {sidebar:{$regex: matchRegex}}
    ]})
  .exec(function(err,subForums){
    if(err){return next(err);}
    res.render('search_results',{title:req.query.searchterm, subForums:subForums});
  })
}

exports.subForum_search_post = [
  body('search').trim().escape(),
  (req,res,next) => {
      res.redirect('/subforums/search?searchterm=' + req.body.search);
  }
]

exports.post_search_get = function(req,res,next){
  let matchRegex = new RegExp("("+req.query.searchterm+")","i");
  async.parallel({
    posts: function(callback){
      Post.find(    
        { $or:[
          {title:{$regex: matchRegex}}, 
          {text:{$regex: matchRegex}}, 
      ]})
      .populate('subForum')
      .populate('submitter')
      .limit(50)
      .exec(callback);
    },
    post_upvotes: function(callback){
      if(res.locals.currentUser){
        PostUpvote.find({submitter: res.locals.currentUser._id})
        .exec(callback);
      }
      else{ callback(null,[])}
    },
    post_downvotes: function(callback){
      if(res.locals.currentUser){
        PostDownvote.find({submitter: res.locals.currentUser._id})
        .exec(callback);
      }
      else{ callback(null,[])}
    }
  }, function(err,results){
    if(err){return next(err);}
    let posts = results.posts;
    if(res.locals.currentUser){
      posts = getUserVotes(posts, results.post_upvotes, results.post_downvotes);
    }
    res.render('search_results', {title:req.query.searchterm, posts:posts})
  })
}

exports.post_search_post = [
  body('search').trim().escape(),
  (req,res,next) => {
      res.redirect('/search?searchterm=' + req.body.search);
  }
]

exports.subforum_post_search_get = function(req,res,next){
  let matchRegex = new RegExp("("+req.params.subForumName+")\\b","i")
  SubForum.findOne({name: {$regex: matchRegex}})
  .populate({
    path: 'moderators',
      populate: {
        path: 'user'
      }
  }).exec(function(err,subForum){
    if(err){return next(err);}
    if(!subForum){
      var err = new Error('SubForum not found');
      err.status = 404;
      return next(err);
    }
    let matchRegex = new RegExp("("+req.query.searchterm+")","i");
    async.parallel({
      posts: function(callback){
        Post.find(    
          { subForum:subForum._id, $or:[
            {title:{$regex: matchRegex}}, 
            {text:{$regex: matchRegex}}, 
        ]})
        .populate('subForum')
        .populate('submitter')
        .limit(50)
        .exec(callback);
      },
      post_upvotes: function(callback){
        if(res.locals.currentUser){
          PostUpvote.find({submitter: res.locals.currentUser._id})
          .exec(callback);
        }
        else{ callback(null,[])}
      },
      post_downvotes: function(callback){
        if(res.locals.currentUser){
          PostDownvote.find({submitter: res.locals.currentUser._id})
          .exec(callback);
        }
        else{ callback(null,[])}
      }
    }, function(err,results){
      if(err){return next(err);}
      let posts = results.posts;
      if(res.locals.currentUser){
        posts = getUserVotes(posts, results.post_upvotes, results.post_downvotes);
      }
      res.render('search_results', {title:req.query.searchterm, posts:posts})
    })
  })
}
exports.subforum_post_search_post = [
  body('search').trim().escape(),
  (req,res,next) => {
      res.redirect('/r/'+req.params.subForumName+'/search?searchterm='+req.body.search);
  }
]