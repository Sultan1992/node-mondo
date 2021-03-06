"use strict";

var createError = require('http-errors');

var express = require('express');

var path = require('path');

var cookieParser = require('cookie-parser');

var logger = require('morgan');

var indexRouter = require('./routes/users');

var usersRouter = require('./routes/users');

var campsiteRouter = require('./routes/campsiteRouter');

var promotionRouter = require('./routes/promotionRouter');

var partnerRouter = require('./routes/partnerRouter');

var mongoose = require('mongoose'); //import


var url = 'mongodb://localhost:27017/nucampsite';
var connect = mongoose.connect(url, {
  useCreateIndex: true,
  useFindAndModify: false,
  useNewUrlParser: true,
  useUnifiedTopology: true
});
connect.then(function () {
  return console.log('Connected correctly to server');
}, function (err) {
  return console.log(err);
});
var app = express(); // view engine setup

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));
app.use(cookieParser());

function auth(req, res, next) {
  console.log(req.headers);
  var authHeader = req.headers.authorization;

  if (!authHeader) {
    var err = new Error('You are not authenticated!');
    res.setHeader('WWW-Authenticate', 'Basic');
    err.status = 401;
    return next(err);
  }

  var auth = Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':');
  var user = auth[0];
  var pass = auth[1];

  if (user === 'admin' && pass === 'password') {
    return next(); // authorized
  } else {
    var _err = new Error('You are not authenticated!');

    res.setHeader('WWW-Authenticate', 'Basic');
    _err.status = 401;
    return next(_err);
  }
}

app.use(auth);
app.use(express["static"](path.join(__dirname, 'public')));
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/campsites', campsiteRouter);
app.use('/promotions', promotionRouter);
app.use('/partners', partnerRouter); // catch 404 and forward to error handler

app.use(function (req, res, next) {
  next(createError(404));
}); // error handler

app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {}; // render the error page

  res.status(err.status || 500);
  res.render('error');
});
module.exports = app;