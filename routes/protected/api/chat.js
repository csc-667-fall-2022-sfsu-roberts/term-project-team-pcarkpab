const express = require('express');
const router = express.Router();

router.post('/:id', (req, res, next) =>{
  const {id} = req.params;
  const {message} = req.body;
  const {username} = req.session;
  const timestamp = Date.now();

  req.app.io.emit(`chat:${id}`, {
    sender: username,
    message,
    timestamp,
  })

  res.sendStatus(200);

})


module.exports = router;