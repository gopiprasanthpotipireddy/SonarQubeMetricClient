var express = require('express');

//controllers
const sonarrouter =require('../controllers/sonarcontroller');


let api=express.Router();
  //register api points
 api.use('/sonar',sonarrouter);
  
 //errorhandler
  api.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
  
    // render the error page
    res.status(err.status || 500);
   // res.render('error');
  });
 


module.exports = api;
