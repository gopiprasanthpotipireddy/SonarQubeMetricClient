var mongoose=require('mongoose');
dburl=require('../config/dbconfig')
var sonarProject = new mongoose.Schema({
  
      collectorName: String,
      lastExecuted: { type: String, trim: true },
      projectId:{type:Number},
      projectName:String,
      metrics:{
          nloc:Number,
          nviolations:Number,

      }
    
  });
  try {
    await mongoose.connect(dburl, { useNewUrlParser: true });
  } catch (error) {
    handleError(error);
  }
  module.exports=mongoose.model('sonarProject',sonarProject);