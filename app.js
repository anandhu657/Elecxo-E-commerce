var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var db = require('./config/connection')
var hbs = require('express-handlebars');
var session = require('express-session')
var Handlebars = require('handlebars');
var bodyParser = require('body-parser')


var userRouter = require('./routes/user');
var adminRouter = require('./routes/admin');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');


Handlebars.registerHelper("inc", function (value, options) {
  return parseInt(value) + 1;
});

Handlebars.registerHelper('ifCheck', function (arg1, arg2, options) {
  return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
})

Handlebars.registerHelper('ifGT', function (a, b) {
  var next = arguments[arguments.length - 1];
  return (a > b) ? next.fn(this) : next.inverse(this);
});

Handlebars.registerHelper('ifNE', function (arg1, arg2, options) {
  return (arg1 != arg2) ? options.fn(this) : options.inverse(this);
})

Handlebars.registerHelper('ifDateCheck', function (arg1, options) {
  let date = new Date() - 0
  let minusDate = arg1 - (10 * 24 * 60 * 60 * 1000);
  return (date > minusDate) ? options.fn(this) : options.inverse(this);
})

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cookieParser());
app.use(session({ secret: "Key", cookie: { maxAge: 864000000 } }));
app.engine('hbs', hbs.engine({ extname: 'hbs', defaultLayout: 'layout', layoutsDir: __dirname + '/views/layout/', partialsDir: __dirname + '/views/partials/' }));
app.use(express.static(path.join(__dirname, 'public')));
app.use((req, res, next) => {
  res.set('Cache-Control', 'no-cache, private,no-store,must-revalidate,max-stale=0,pre-check=0')
  next()
})

db.connect((err) => {
  if (err) {
    console.log("Database not connected " + err)
  } else {
    console.log("Database connected")
  }
})

app.use('/', userRouter);
app.use('/admin', adminRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
