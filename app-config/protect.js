const protect = (req, res, next) => {
  if(req.session.authenticated){
    next();
  }else{
    console.log("Must be login!");
    res.redirect('/login');
  }
}

module.exports = protect;