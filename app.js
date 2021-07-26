var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
const mongoose = require('mongoose');

var planRouter = require('./routes/planRouter');

const url = 'mongodb://localhost:27017/conFusion';

// var db = mongoose.connection;

// var Schema = mongoose.Schema;

// db.on('error', console.error);

// db.once('open', function () {

//     console.log("db connect");

//     db.dropCollection("plans", function (err, result) {

//         if (err) {

//             console.log("error delete collection");

//         } else {

//             console.log("delete collection success");

//         }

//     });

 

// });

const connect = mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false});

connect.then((db) => {
    console.log('Connected correctly to server');
}, (err) => {
    console.log(err);
});

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/plans', planRouter);

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
