var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport');
var mongoose = require('mongoose');
var session = require('cookie-session');
var compression = require('compression');
require('dotenv').config();

var routes = require('./routes/index');
var admin = require('./routes/admin');
var events = require('./routes/events');
var fc = require('./routes/fc');

require(require('path').join(__dirname, './utils/passportAuth.js'))(passport);
mongoose.connect(process.env.MONGO_URI);
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(passport.initialize());
app.use(cookieParser(process.env.COOKIE_SECRET || 'secret'));
app.use(session({
  keys: ['keyboard', 'cat'],
  secret: process.env.COOKIE_SECRET || 'secret',
  cookie: {
    secure: true,
    expires: new Date( 5 * Date.now() + 60 * 60 * 1000 )
  }
}))
app.use(passport.session());
app.use(compression({level: 6}));

app.use('/', routes);
app.use('/admin', admin);
app.use('/events', events);
app.use('/fc', fc);

/// catch 404 and forwarding to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
