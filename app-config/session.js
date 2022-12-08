const session = require("express-session");

const sessionInstance = session({
  key:"sid",
  secret: "thisisoursecretkeycsc667",
  cookie: {maxAge: 30 * 60 * 1000},
  resave: false,
  saveUninitialized: true,
});

module.exports = sessionInstance;