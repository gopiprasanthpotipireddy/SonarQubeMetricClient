sonarClient=require('./sonarClient')
dburl=require('../config/dbconfig')
sonarProject=require('../models/sonarProject')
sonarCollector=require('../models/sonarCollector')
const {Observable,from,of} =require('rxjs')
const { mergeMap,map }= require('rxjs/operators/')
conf=require('../config/sonarconfig')

class collectorTask{
    constructor(){

        this.sonarclient=new sonarClient();

        
    }

      collect(config)  {
        
        let sonar=this.sonarclient;
        let addProjects=this.addProjects;
        //let addMetrics=this.addMetrics;
        let addCollector=this.addCollector;
        let getMetricsFromProjects=this.getMetricsFromProjects;
        let collectorpromise=new Promise((resolve,reject)=>this.addCollector(config,(collector,err)=>
            {
                if(!err) resolve(collector);
                else reject(err);
            
            }));

            collectorpromise.then((collector)=>{
                console.log("collecting sonar Data from :"+collector.server);
            
            }).catch(err=>console.log(err));
        
        let projectpromise=sonar.getProjects(config);
            projectpromise.then(projects=>{
                let components=projects.components;
                let sonarclient=new sonarClient();
                let metricsObserver=from(components).pipe(map(component=>{
        
                   let metricsPromise= sonarclient.getMetrics(conf,component['id']).then(metrics=>{
                    
                    this.addMetrics(metrics.component,(status,err)=>{
                        if(!err) return of("");
                        else return err;
                    });
                }).catch(err=>console.log(err));
            }));
        metricsObserver.subscribe(status=> console.log(""));
        
        }
            ).catch(err=>console.log(err));
           
           
             // new Promise(function(resolve,reject){
        //      addCollector(config,(collector,err)=>
        //     {
        //         if(!err) resolve(collector);
        //         else throw err;
            
        //     });
        // }
            
        // ).then((collector)=>{
        //     sonar.getProjects(config,function(err,projects){
        //         if(!err){
        //          //addProjects(projects,function(err,projects){
        //              projects.forEach(project => {
        //                  console.log("collecting :"+ project['key']);
                         
        //                  sonar.getMetrics(config,project['id'],function(err,Metrics){
        //                      if(!err){
        //                      addMetrics(project,Metrics);
        //                      //console.log(Metrics);
        //                      }
        //                      else console.error(err);
        //                  });
                         
        //              });
        //         console.log('Collected Projects : '+ projects.length);
        //         }
        //          else{
        //              console.error(err);
        //          }
        //      });
        // }
        // ).catch((err)=>console.log(err))

    }
        

    getMetricsFromProjects(projects){
        let components=projects.components;

        let sonarclient=new sonarClient();
        let metricsObserver=from(components).pipe(map(async component=>{

            let metricsPromise= await sonarclient.getMetrics(conf,component['id']).then(metrics=>{ console.log(metrics);}).catch(err=>console.log(err));
        }));

        metricsObserver.subscribe(metrics=> {
            
            let savemetrics=new Promise((resolve,reject)=>{
                this.addMetrics(metrics,(status,err)=>{
                    if(!err) resolve("");
                    else reject(err);
                });

            });

            savemetrics.then((status)=>console.log("")).catch(err=>console.log(err));

        });

    }

    addMetrics(Metrics,cb){
        let projectkey=Metrics['key'];
        let projectid=Metrics['id'];
        let measures=Metrics['measures'];

        let query= sonarProject.findOne({projectName:projectkey});
        query.exec(function(err,sonarproject){
            if(!err){
            if(sonarproject!=null){
                console.log("Updating Project Metrics :" +projectkey);
                //console.log(sonarproject);
                //let updatedproject=new sonarProject(sonarproject);
               // updatedproject=sonarproject._id;
                sonarproject.metrics=measures;
                sonarproject.lastExecuted=new Date().toString(); 
                sonarproject.save();
                cb(1,null);
            }
            else {
                let newproject=new sonarProject({
                    collectorName:"sonarCollector",
                    projectName:projectkey,
                    projectId:projectid,
                    lastExecuted:new Date().toLocaleDateString(),
                    metrics:Metrics
            });
                console.log("Creating New Project :" + projectkey);
                newproject.save(function(err){
                    if (err) {
                         console.log(err);
                         cb(0,err);
                    }
                });
                cb(1,null);
            }
        }
        else {cb(0,err)};
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