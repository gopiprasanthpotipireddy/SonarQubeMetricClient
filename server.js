collectorTask=require('./collector/collectorTask');
var cron = require('node-cron');
var settings=require('./config/settings');
var sonarconfig=require('./config/sonarconfig');

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