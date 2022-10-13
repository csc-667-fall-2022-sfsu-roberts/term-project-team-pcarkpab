var express = require('express');
var router = express.Router();
const app = express();
const port = 3001;

app.listen(port, () => console.log('App listening to post ${port}'));

app.get('/', (req, res) => res.send('Hello World!'));
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
