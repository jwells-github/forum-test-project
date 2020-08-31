const mongoose = require('mongoose');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require("bcryptjs");

const User = require('../models/user');


module.exports = function(passport) {

  passport.use(new LocalStrategy((username,password,done) =>{
    User.findOne({username:username}, (err,user) =>{
      if(err){return done(err);}
      if(!user){return done(null, false, {message: 'Incorrect Username'});}
      bcrypt.compare(password, user.password, (err,res) =>{
        if(err){return done(err);}
        // passwords match
        if(res){
          return done(null, user);}
        else{ return done(null, false, {message: "Incorrect password"});}
      });
      //return done(null,user);
    });
  }
  ))
  
  passport.serializeUser(function(user, done) {
    return done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      return done(err, user);
    });
  });
};