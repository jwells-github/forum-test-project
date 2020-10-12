const Post = require("../models/post");
const PostUpvote = require("../models/votes/post_upvote");
const PostDownvote = require("../models/votes/post_downvote");
const async = require("async");

const getUserVotes = require('../public/javascripts/getUserVotes.js');

exports.default_view_get =  function(req, res, next) {
  let now = new Date(Date.now())
  let one_day_ago = new Date()
  one_day_ago.setHours(now.getHours()-24)
  let two_days_ago = new Date()
  two_days_ago.setHours(now.getHours()-(24*2))
  let one_week_ago = new Date();
  one_week_ago.setHours(now.getHours()-(24*7));
  
  async.parallel({
    todays_posts: function(callback){
      Post.find({date_created_at: {$gte: one_day_ago}})
      .sort({upvote_count :-1})
      .populate('subForum')
      .populate('submitter')
      .limit(50)
      .exec(callback);
    },
    yesterdays_posts: function(callback){
      Post.find({date_created_at: {$gte: two_days_ago, $lt: one_day_ago}})
      .sort({upvote_count :-1})
      .populate('subForum')
      .populate('submitter')
      .limit(50)
      .exec(callback);
    },
    last_weeks_posts: function(callback){
      Post.find({date_created_at: {$gte: one_week_ago, $lt: two_days_ago}})
      .sort({upvote_count :-1})
      .populate('subForum')
      .populate('submitter')
      .limit(50)
      .exec(callback);
    },
    older_posts: function(callback){
      Post.find({date_created_at: {$lt: one_week_ago}})
      .sort({upvote_count :-1})
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
    let posts = results.todays_posts.concat(results.yesterdays_posts,results.last_weeks_posts,results.older_posts);
    if(res.locals.currentUser){
      posts = getUserVotes(posts, results.post_upvotes, results.post_downvotes);
    }
    res.render('index', { title: 'Forum Project', posts:posts, flash_messages: req.flash('info')});
  })
}

exports.sorted_get = function(req,res,next){
  let sortParam = {}
  // Get most recent posts
  if(req.path === '/new'){
    sortParam = {date_created_at:-1};
  }
  // Get most upvoted posts
  else if(req.path === '/top'){
    sortParam = {upvote_count:-1};
  }
  async.parallel({
    posts: function(callback){
      Post.find()
      .sort(sortParam)
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
    let posts = results.posts
    if(res.locals.currentUser){
      posts = getUserVotes(results.posts, results.post_upvotes, results.post_downvotes);
    }
    res.render('index', { title: 'Forum Project', posts:posts});
  })
}
