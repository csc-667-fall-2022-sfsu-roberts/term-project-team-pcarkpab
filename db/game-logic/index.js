const initialize = require('./initialize');
const getData = require('./getData');
const bet = require('./bet');
const nextTurn = require('./nextTurn');
const assignCards = require('./assignCards');
const check = require('./check');
const fold = require('./fold');

module.exports = {
  initialize,
  getData,
  bet,
  nextTurn,
  assignCards,
  check,
  fold,
}