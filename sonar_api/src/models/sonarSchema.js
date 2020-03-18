const mongoose = require('mongoose');
var sonarProject = new mongoose.Schema({
  
    collectorName: String,
    lastExecuted: { type: String},
    projectId:{type:String},
    projectName:String,
    metrics:JSON
  
});

module.exports=sonarProject