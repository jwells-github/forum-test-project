const { body,validationResult } = require('express-validator');
const { sanitizeBody } = require('express-validator');
const bcrypt = require("bcryptjs");

const User = require('../models/user');

exports.user_create_get = function(req,res,next){
  if(res.locals.currentUser){
    req.flash('info', 'You must log out before signing up for another account')
    res.redirect('/')
  }
  else{
    res.render('signup_form', {title: 'Signup', flash_messages: req.flash('info')});
  }
}

exports.user_create_post = [
  sanitizeBody('*').trim(),
  body('username', 'Usernames must be longer than 2 characters, less than 21 and may only contains Numbers, English characters and underscores')
    .isLength({min:3})
    .isLength({max:20})
    .custom(value =>{
      return User.findOne({'username': value}).then(user =>{
        if(user){
           return Promise.reject('Username in use');
        }
      });
    })
    .custom(value =>{
      if(!/^[a-zA-Z0-9_]*$/gm.test(value)){
        throw new Error('Usernames must be longer than 2 characters and may only contains Numbers, English characters and underscores')
      }
      return true
    }),
  body('password')
    .isLength({min: 6}).withMessage('Passwords must be at least 6 characters')
    .matches(/[A-Z]/).withMessage('Passwords must contain a mix of upper and lowercase characters')
    .matches(/[a-z]/).withMessage('Passwords must contain a mix of upper and lowercase characters')
    .matches(/[0-9]/).withMessage('Passwords must contain atleast one number'),

  (req,res,next) =>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
      res.render('signup_form', {title: 'Signup', errors: errors.array(), email: req.body.email, username: req.body.username});
      return;
    }
    else{
      bcrypt.hash(req.body.password, 10, (err, hashedPassword) =>{
        if(err){return next(err)}
        
        var user = new User({
          username: req.body.username,
          password: hashedPassword,
        });
        user.save(function(err){
          if(err){return next(err);}
          req.login(user, function(err){
            if(err){return next(err);}
            return res.redirect('/')
          })
        })
      });
    }
  }
]