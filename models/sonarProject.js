var mongoose=require('mongoose');
dburl=require('../config/dbconfig')
var sonarProject = new mongoose.Schema({
  
      collectorName: String,
      lastExecuted: { type: String},
      projectId:{type:String},
      projectName:String,
      metrics:JSON
    
  });
  
  mongoose.connect(dburl, { useNewUrlParser: true , useUnifiedTopology: true});
  
  module.exports=mongoose.model('sonarProject',sonarProject);