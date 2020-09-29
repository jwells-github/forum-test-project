const {body} = require('express-validator');
const Subreddit = require('../models/subreddit');

exports.subreddit_search_get = function(req,res){
  let matchRegex = new RegExp("("+req.query.searchterm+")");
  Subreddit.find(
    { $or:[
        {name:{$regex: matchRegex}}, 
        {description:{$regex: matchRegex}}, 
        {sidebar:{$regex: matchRegex}}
    ]})
  .exec(function(err,subreddits){
    if(err){return next(err);}
    res.render('search_results',{title:req.query.searchterm, subreddits:subreddits});
  })
}

exports.subreddit_search_post = [
  body('search').trim().escape(),
  (req,res,next) => {
      res.redirect('/search?searchterm=' + req.body.search);
  }
]