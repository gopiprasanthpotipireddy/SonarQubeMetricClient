sonarClient=require('./sonarClient')
dburl=require('../config/dbconfig')
sonarProject=require('../models/sonarProject')
sonarCollector=require('../models/sonarCollector')
const { from, Observable ,throwError,EMPTY  } =require('rxjs')
const { map,mergeMap,flatMap } = require('rxjs/operators');
class collectorTask{
    constructor(){

        this.sonarClient=new sonarClient(); 
        
    }

    async collect(config)  {
        let sonar=this.sonarClient;
        let addProjects=this.addProjects;
        let addMetrics=this.addMetrics;
        let addCollector=this.addCollector;
        let collectorpromise= new Promise(async function(resolve,reject){
             addCollector(config,(collector,err)=>
            {
                if(!err) resolve(collector);
                else throw err;
            
            });
        });

         collectorpromise.then(async collector=> {

             sonar.getProjects(config,async function(err,projects){
                if(!err){

                   let projectmetrics=projects.map(project=> sonar.getMetrics(config,project['id']))
                    const result = await Promise.all(projectmetrics).then((metrics)=>
                    metrics.forEach(metric=>
                    addMetrics("ad",metric,()=>{})))
                    .catch(err=>console.log(err));;

                
                 //addProjects(projects,function(err,projects){
                   // forkJoin(metricObservable).subscribe();

                  // let metricObservable= from(projects).pipe(flatMap(project=> 
                  //   project.key
                    // sonar.getMetrics(config,project['id'],function(err,Metrics){
                        
                    //     if(!err){
                    //     return new Observable(subsciber=>addMetrics(project,Metrics,function(err,sonarproject){
                    //         if(!err) subsciber.next(sonarproject) ;
                    //         else return throwError(err);
                    //     }));
                    //     //console.log(Metrics);
                    //     }
                    //     else return throwError(err);
                    // })
                   //,2));
                   
                    //projects in series using foreach
                   /*  projects.forEach(project => {
                         console.log("collecting :"+ project['key']);
                         
                         sonar.getMetrics(config,project['id'],function(err,Metrics){
                             if(!err){
                             addMetrics(project,Metrics);
                             //console.log(Metrics);
                             }
                             else console.error(err);
                         });
                         
                     });
                console.log('Collected Projects : '+ projects.length);
                */
                }
                 else{
                     console.error(err);
                 }
             });

        }).catch((err)=>console.log(err));
        
       
        
       
    }


    addMetrics(project,Metrics,cb){
        
        let query= sonarProject.findOne({projectName:project['key']});
        query.exec(function(err,sonarproject){
            if(!err){
            if(sonarproject!=null){
                console.log("Updating Project Metrics :" +project.key);
                //console.log(sonarproject);
                let updatedproject=new sonarProject(sonarproject);
               // updatedproject=sonarproject._id;
                sonarproject.metrics=Metrics;
                sonarproject.lastExecuted=new Date().toString(); 
                sonarproject.save();
                cb(null,sonarproject);
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
                         cb(err,null);
                    }
                });
                cb(null,newproject);
            }
        }
        else {
            console.log(err);
            cb(err,null);
        }
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
                cb(collector,null);
                }
                else {
                   let sonarcollector= new sonarCollector({
                        collectorName:"sonarCollector",
                        colletorType:"Quality",
                        server:config.server,
                        lastExecuted:new Date().toTimeString()
                    });
                    sonarcollector.save();
                    cb(collector,null);

                }
                //cb(1,null);
            }
            else {
                cb(null,err);
            }
        });

        
    }
}

module.exports=collectorTask