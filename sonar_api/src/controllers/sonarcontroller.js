sonarproject=require('../models/sonar/sonarProject');
express =require('express');

//Get all the Projects
const projectlist=async (req,res,next)=>{
    try{
        const projects= await sonarproject.find({});
        console.log("GET :"+ req.originalUrl);
        res.status(200).send(projects);
       
    }
    catch(err){
        next(err);
    }
};

//project By projectId
const project=async (req,res,next)=>{
    const id=req.params.id;
    try{
        const project= await sonarproject.findOne({projectId:id});
        console.log("GET :"+ req.originalUrl);
        res.status(200).send(project);
       
    }
    catch(err){
        next(err);
    }
};

    let router=express.Router();
    router.get('/ping', function(req,res,next){res.status(200).send("Hello")});
    router.get('/projects',projectlist);
    router.get('/projects/:id',project);

    //errorhandler
    router.use(function(err, req, res, next) {
      // set locals, only providing error in development
      res.locals.message = err.message;
      res.locals.error = req.app.get('env') === 'development' ? err : {};

      // render the error page
      res.status(err.status || 500);
    });

   

module.exports=router;