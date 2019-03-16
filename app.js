var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var favicon = require('serve-favicon');
var indexRouter = require('./routes/index');

var expresshbs = require('express-handlebars');
var mongoose = require('mongoose');

var session = require('express-session');

var app = express();
mongoose.connect('mongodb+srv://admin:'+ process.env.MONGO_ATLAS_PW +'@cluster0-2jycn.mongodb.net/patientdb?retryWrites=true',{ useNewUrlParser: true });

var db = mongoose.connection;

//handle mongo error
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  console.log('mongodb connected!');
});

//set favicon icon
app.use(favicon(__dirname + '/public/images/favicon.ico'));

//use sessions for tracking logins
app.use(session({
  secret: 'work hard',
  resave: true,
  saveUninitialized: false,
  cookie: { maxAge: 1800000 }
}));

var hbs = expresshbs.create({
  defaultLayout: 'layout',
  extname: '.hbs',
  // Specify helpers which are only registered on this instance.
  helpers: {
    compare: function(lvalue, operator, rvalue, options) {

      if (arguments.length < 3)
        throw new Error("Handlerbars Helper 'compare' needs 2 parameters");

      var operators = {
        '==':       function(l,r) { return l == r; },
        '===':      function(l,r) { return l === r; },
        '!=':       function(l,r) { return l != r; },
        '<':        function(l,r) { return l < r; },
        '>':        function(l,r) { return l > r; },
        '<=':       function(l,r) { return l <= r; },
        '>=':       function(l,r) { return l >= r; },
        'typeof':   function(l,r) { return typeof l == r; }
      }

      if (!operators[operator])
        throw new Error("Handlerbars Helper 'compare' doesn't know the operator "+operator);

      var result = operators[operator](lvalue,rvalue);

      if( result ) {
        return options.fn(this);
      } else {
        return options.inverse(this);
      }

    },
    math: function(lvalue, operator, rvalue, options) {

      if (arguments.length < 3)
        throw new Error("Handlerbars Helper 'math' needs 2 parameters");

      var operators = {
        '+':       function(l,r) { return l + r; },
        '/':      function(l,r) { return l / r; },
        '*':       function(l,r) { return l * r; },
        '-':        function(l,r) { return l - r; }
      }

      if (!operators[operator])
        throw new Error("Handlerbars Helper 'math' doesn't know the operator "+operator);

      var result = operators[operator](Number(lvalue), Number(rvalue));

      if( result ) {
        return options.fn(result);
      } else {
        return options.inverse(this);
      }

    },
    times: function(start, n, block) {
      var accum = '';
      for(var i = Number(start); i <= n; ++i)
          accum += block.fn(i);
      return accum;
    }
  }
});

app.engine('.hbs', hbs.engine);
//app.set('view engine', 'hbs');
app.set('view engine', '.hbs');


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '/public')));
app.use('/bower_components',  express.static(__dirname + '/bower_components'));

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
  res.render('error');
});

module.exports = app;
