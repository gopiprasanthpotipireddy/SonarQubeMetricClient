sonarClient=require('./sonarClient')
dburl=require('../config/dbconfig')
sonarProject=require('../models/sonarProject')
sonarCollector=require('../models/sonarCollector')
class collectorTask{
    constructor(){

        this.sonarClient=new sonarClient(); 
        
    }

     collect(config)  {
        let sonar=this.sonarClient;
        let addProjects=this.addProjects;
        let addMetrics=this.addMetrics;
        let addCollector=this.addCollector;
        new Promise(function(resolve,reject){
            addCollector(config,(success,err)=>
            {
                if(!err) resolve(success);
                else throw err;
            
            });
        }
            
        ).then((success)=>{
            sonar.getProjects(config,function(err,projects){
                if(!err){
                 //addProjects(projects,function(err,projects){
                     projects.forEach(project => {
                         console.log("collecting"+ project['key']);
                         
                         sonar.getMetrics(config,project['id'],function(err,Metrics){
                             if(!err){
                             addMetrics(project,Metrics);
                             //console.log(Metrics);
                             }
                             else console.error(err);
                         });
                         
                     });
                }
                 else{
                     console.error(err);
                 }
             });
        }
        ).catch((err)=>console.log(err))
       
    }


    addMetrics(project,Metrics){
        
        let query= sonarProject.findOne({projectName:project['key']});
        query.exec(function(err,sonarproject){
            if(!err){
            if(sonarproject!=null){
                console.log("Updating Project :" +project.key);
                //console.log(sonarproject);
                let updatedproject=new sonarProject(sonarproject);
               // updatedproject=sonarproject._id;
                sonarproject.metrics=Metrics;
                sonarproject.lastExecuted=new Date().toString(); 
                sonarproject.save();
            }
            else {
                let newproject=new sonarProject({
                    collectorName:"sonarCollector",
                    projectName:project['key'],
                    projectId:project['id'],
                    lastExecuted:new Date().toLocaleDateString(),
                    metrics:Metrics
            });
                console.log("Creating New Project :" + project.key);
                newproject.save(function(err){
                    if (err) {
                         console.log(err);
                    }
                });
            }
        }
        else console.log(err);
        });
        
    }

     addProjects(projects){

        projects.forEach(project => {

            let sonarproject=new sonarProject({
                collectorName:"sonarCollector",
                projectName:project['key'],
                projectId:project['id']
            
        });
        sonarproject.save(function(err){
            if (err) {
                 console.log(err);
            }
        });

        })
    }

    addCollector(config,cb){
        
        let query=sonarCollector.findOne({collectorName:"sonarCollector"});
        query.exec(function(err,collector) {
                if(!err){
                if(collector!=null){
                collector.server=config.server;
                collector.lastExecuted=new Date().toTimeString();
                collector.save();
                }
                else {
                   let sonarcollector= new sonarCollector({
                        collectorName:"sonarCollector",
                        colletorType:"Quality",
                        server:config.server,
                        lastExecuted:new Date().toTimeString()
                    });
                    sonarcollector.save();

                }
                cb(1,null);
            }
            else {
                cb(null,err);
            }
        });

        
    }
}

module.exports=collectorTask