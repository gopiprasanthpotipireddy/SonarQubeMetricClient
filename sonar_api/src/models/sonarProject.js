const mongoose=require('mongoose');
const sonarschema=require('./sonarSchema');
dburl=require('../config/dbconfig')

 
mongoose.connect(dburl, { useNewUrlParser: true , useUnifiedTopology: true})
module.exports=mongoose.model('sonarProject',sonarschema);