var mongoose=require('mongoose');
dburl=require('../config/dbconfig')

var sonarCollector = new mongoose.Schema({
  
      collectorName: String,
      lastExecuted: { type: Date },
      collectorType:{type:String},
      server:{type:String}
    
  });
  try {
    await mongoose.connect(dburl, { useNewUrlParser: true });
  } catch (error) {
    handleError(error);
  }
 module.exports=mongoose.model('collector',sonarCollector);