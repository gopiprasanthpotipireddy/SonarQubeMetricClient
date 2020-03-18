var mongoose=require('mongoose');
dburl=require('../config/dbconfig')

  var mongoManger=()=>{
    mongoose.connect(dburl, { useNewUrlParser: true , useUnifiedTopology: true})
  }
 
  
  module.exports=mongoManger;