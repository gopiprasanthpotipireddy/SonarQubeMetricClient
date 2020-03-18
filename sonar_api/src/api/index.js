var express = require('express');
//var api = express.Router();
//models
const {sonarproject}=require('../models/sonarProject');

//controllers
const projectrouter =require('../controllers');
const models={sonarproject};


let api=express.Router();
  //register api points
 api.use('/projects',projectrouter);
  
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
