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

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var testsRouter = require('./routes/tests');



var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


//View Engine set up
app.engine("hbs", engine({
  extname: '.hbs',
  layoutsDir: path.join(__dirname, "views/layouts"), 
  defaultLayout: "layout",
})
);

app.set("views", path.join(__dirname, "views/pages"));
app.set("view engine", "hbs");


app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/tests', testsRouter);

module.exports = app;
