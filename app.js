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

// Import routes
var indexRouter = require('./routes/public/index');
var testsRouter = require('./routes/public/tests');
var lobbyRouter = require('./routes/protected/lobby');
var gameRouter = require('./routes/protected/game');
var usersRouter = require('./routes/protected/users');


var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
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


app.use('/', indexRouter);
app.use('/tests', testsRouter);
app.use('/lobby', lobbyRouter);
app.use('/game', gameRouter);
app.use('/users', usersRouter);


// When a user encouters a webpage error
app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = err;
  console.log(err);

  res.status(err.status || 500);
  res.render("unauthenticated/error");
})

module.exports = app;
