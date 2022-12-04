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

var indexRouter = require('./routes/public/index');
var testsRouter = require('./routes/public/tests');

var lobbyRouter = require('./routes/protected/lobby');
var gameRouter = require('./routes/protected/game');


//Added extra Authenticated Pages
var aboutRouter  = require('./routes/protected/about_auth');
var addPaymentRouter  = require('./routes/protected/addPayment');
var howToPlayRouter  = require('./routes/protected/howtoplay_auth');
var settingsRouter  = require('./routes/protected/settings');
var waitingRoomRouter  = require('./routes/protected/waitingRoom');



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

//Protected router stuff
app.use('/lobby', lobbyRouter);
app.use('/game', gameRouter);
app.use('/waitingRoom', waitingRoomRouter);

//Extra protected Pages
app.use('/about_auth', aboutRouter);
app.use('/addPayment', addPaymentRouter);
app.use('/howtoplay_auth', howToPlayRouter);
app.use('/settings', settingsRouter);


app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = err;
  console.log(err);

  res.status(err.status || 500);
  res.render("pages/error");
})

module.exports = app;
