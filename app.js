// HTTP-errors module is used for generating errors for Node. js applications
var createError = require('http-errors'); 
   
// express is a framework
var express = require('express');

// The Path module provides a way of working with directories and file paths.
var path = require('path');

// cookie-parser is a middleware which parses cookies attached to the client request object. 
var cookieParser = require('cookie-parser');

// Morgan is another HTTP request logger middleware for Node. js. It simplifies the process of logging requests to your application.
var logger = require('morgan');
var indexRouter = require('./routes/index');

// if you want to use multiple javascript engines you can do that using consolidate package
var engines = require('consolidate');

// Session management can be done in node. js by using the express-session module. 
// It helps in saving the data in the key-value form. In this module, 
// the session data is not saved in the cookie itself, just the session ID.
var session = require('express-session');

var app = express();

// session setup
app.use(session({
  // It holds the secret key for session
  secret : 'ABCDefg',

  // Forces the session to be saved back to the session store
  resave : false,
  
  // Forces a session that is "uninitialized" to be saved to the store
  saveUninitialized : true
}));


// view engine setup

app.engine('html', engines.swig); // take note, using 'html', not 'ejs' or 'pug'..
app.set('view engine', 'html'); // also 'html' here.
app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'pug');
// app.set('view engine', 'ejs');

// It allows you to modify the log using tokens or add color to them by defining 'dev' or even logging out to an output stream, like a file.
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// To use it, we will require it in our index. js file; this can be used the same way as we use other middleware.
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);

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
  res.render('error.pug', {});
});

// Create Server
app.listen(3000, () => {
  console.log('Listening on port 3000...');
});

module.exports = app;
