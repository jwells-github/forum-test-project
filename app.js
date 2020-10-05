var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var flash = require('connect-flash');
const session = require("express-session");
const passport = require('passport');
require('./config/passport')(passport);

require('dotenv').config()


// Database connection  
var mongoose = require('mongoose');
var mongoDB = 'mongodb+srv://j:'+process.env.DB_PASSWORD+'@cluster0-bnapd.mongodb.net/'+process.env.DB_NAME+'?retryWrites=true&w=majority';
mongoose.connect(mongoDB, { useNewUrlParser: true });
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var indexRouter = require('./routes/index');
var deletionRouter = require('./routes/deletion');
var removalRouter = require('./routes/removal');
var votingRouter = require('./routes/voting');
var signupRouter = require('./routes/signup');
var loginRouter = require('./routes/login');
var subForumRouter = require('./routes/subForum');
var subForumDetailRouter = require('./routes/subForumDetail');
var usersRouter = require('./routes/users');

var app = express();
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({secret: process.env.SESSION_SECRET, resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());  
app.use(flash());

app.use(function(req, res, next) {
  res.locals.currentUser = req.user;
  next();
});

const SubForumBan = require('./models/subForum_ban');

app.use('/r/:subForumName', function(req,res,next){
  if(res.locals.currentUser){
    let matchRegex = new RegExp("("+ req.params.subForumName+")\\b","i")
    SubForumBan.findOne({banned_user: res.locals.currentUser._id, subForum_name: {$regex: matchRegex}})
    .exec(function(err,banned_user){
      if(err){return next(err);}
      if(banned_user){
        var err = new Error('You are banned from viewing this subForum')
        err.status = 401;
        return next(err);
      }
      else{
        next();
      }
    })
  }
  else{
    next();
  }

})

app.use('/', indexRouter);
app.use('/delete', deletionRouter);
app.use('/remove', removalRouter);
app.use('/vote', votingRouter);
app.use('/signup', signupRouter);
app.use('/login', loginRouter);
app.use('/subforums', subForumRouter);
app.use('/r',subForumDetailRouter); 
app.use('/u', usersRouter);

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
