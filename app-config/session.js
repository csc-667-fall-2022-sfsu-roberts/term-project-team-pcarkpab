const session = require("express-session");

const sessionInstance = session({
  secret: "thisisoursecretkeycsc667",
  cookie: {maxAge: 15 * 60 * 1000},
  resave: false,
  saveUninitialized: true,
});

module.exports = sessionInstance;