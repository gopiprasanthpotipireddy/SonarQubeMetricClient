mongoose=require('mongoose');
dbhost="localhost";
dbport="27017";
dbname='sonarcollector';
dburl="mongodb://"+dbhost+":"+dbport+"/"+dbname;
//dbconnection=mongoose.connect(dburl);
//db=mongoose.dbconnection;


module.exports=dburl