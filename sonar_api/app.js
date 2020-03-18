const express = require('express');
const sonarproject=require('./src/models/sonarProject');
const config = require('./src/config');
const api = require('./src/api');
const  mongoManager  = require('./src/mongo');
var mongoose=require('mongoose');
dburl=require('./src/config/dbconfig')

 
const app = express();
mongoose.connect(dburl, { useNewUrlParser: true , useUnifiedTopology: true})
// api routes v1
app.use('/api/v1', api);

// app.get('/projects',async function(req,res,next){
//   try{
//       const projects=await sonarproject.find({});
//      res.send(projects)
     
//   }
//   catch(err){
//       next(err);
//   }
// }
// );
app.get('/df/',function(req,res){
  res.send("helo");
})
module.exports = app;
