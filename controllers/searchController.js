const {body} = require('express-validator');
const SubForum = require('../models/subForum');

exports.subForum_search_get = function(req,res){
  let matchRegex = new RegExp("("+req.query.searchterm+")");
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