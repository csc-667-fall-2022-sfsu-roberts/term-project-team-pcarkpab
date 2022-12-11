var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const {engine} = require("express-handlebars");


// To make use the environment variables defined in the .env file in our development environment
//Setting the environment after the database is initialized
if(process.env.NODE_ENV === 'development') {
  require("dotenv").config();
}

//Public routes
var indexRouter = require('./routes/public/index');
var testsRouter = require('./routes/public/api/tests');
var usersRouter = require('./routes/public/api/users');

//Protected routes
var authIndexRouter = require('./routes/protected/authIndex');
var gameRouter = require('./routes/protected/game');
var lobbyRouter = require('./routes/protected/api/lobby');
var chatRouter = require('./routes/protected/api/chat');
var consoleRouter = require('./routes/protected/api/console');
var gameapiRouter = require('./routes/protected/api/gameapi');


//Others
const sessionInstance = require('./app-config/session');
const protect = require('./app-config/protect');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(sessionInstance);
app.use("/public", express.static(path.join(__dirname, 'public')));


//View Engine set up
app.engine("hbs", engine({
  extname: '.hbs',
  layoutsDir: path.join(__dirname, "views/layouts"), 
  partialsDir: path.join(__dirname, "views/partials"),
  defaultLayout: "layout",
})
);

app.set("views", path.join(__dirname, "views/pages"));
app.set("view engine", "hbs");

app.use((req, res, next) =>{
  if(req.session.authenticated){
    res.locals.logged = true;
  }
  next();
})

app.use('/', indexRouter);
app.use('/api/tests', testsRouter);
app.use('/api/users', usersRouter);

app.use('/auth', protect, authIndexRouter);
app.use('/auth/game', protect, gameRouter);
app.use('/api/lobby', protect, lobbyRouter);
app.use('/api/chat', protect, chatRouter);
app.use('/api/console', protect, consoleRouter);
app.use('/api/game', protect, gameapiRouter);


app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = err;
  console.log(err);

  res.status(err.status || 500);
  res.render("error");
})

module.exports = app;
