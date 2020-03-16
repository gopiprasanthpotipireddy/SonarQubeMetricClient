collectorTask=require('./collector/collectorTask');
cron = require('node-cron');
settings=require('./config/settings');
sonarconfig=require('./config/sonarconfig');

class Application{

    constructor(){
        this.sonarconfig=sonarconfig;
        this.Task=new collectorTask();
    }

    run(){
    cron.schedule(settings.cron, () => {
    console.log('Collecting : Sonar Data');
  
     this.Task.collect(sonarconfig)
    });
    }
}

new Application().run();