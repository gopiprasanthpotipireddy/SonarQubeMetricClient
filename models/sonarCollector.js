var mongoose=require('mongoose');
dburl=require('../config/dbconfig')

var sonarCollector = new mongoose.Schema({
  
      collectorName: String,
      lastExecuted: { type: String },
      collectorType:{type:String},
      server:{type:String}
    
  });
  
mongoose.connect(dburl, { useNewUrlParser: true });
 
  
module.exports=mongoose.model('collector',sonarCollector);