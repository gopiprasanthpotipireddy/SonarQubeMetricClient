sonarClient=require('./sonarClient');
dburl=require('../config/dbconfig')
class collectorTask{
    constructor(){

        this.sonarClient=new sonarClient(); 
        
    }

     collect(config)  {
        let sonar=this.sonarClient;
        
        sonar.getProjects(config,function(err,projects){
           if(!err){
            
            projects.forEach(project => {
                console.log("collecting"+ project['key']);
                sonar.getMetrics(config,project['id'],function(err,Metrics){
                    if(!err)
                    console.log(Metrics);
                    else console.err(err);
                });
                
            });
        }
            else{
                console.error(err);
            }
        });
       
    }
}

module.exports=collectorTask