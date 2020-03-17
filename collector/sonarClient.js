const rp = require('request-promise');
const util = require('util');
class sonarClient{
    constructor(){
        this.PROJECT_API='api/components/search?qualifiers=TRK&ps=500'
        this.METRIC_API=`api/measures/component?componentId=%s&metricKeys=ncloc,violations,new_vulnerabilities,critical_violations,major_violations,blocker_violations,tests,test_success_density,test_errors,test_failures,coverage,line_coverage,sqale_index,alert_status,quality_gate_details`
    }

     getProjects(sonar_config){
        var options = {
            uri: sonar_config.baseUrl+this.PROJECT_API,
        
            headers: {
            'User-Agent': 'Request-Promise',
            "Authorization" : sonar_config.auth    },
            json: true // Automatically parses the JSON string in the response
        };
    
        return rp(options);
        //     .then(function (components) {
        //     //console.log( components.components);
        //    cb(null,components.components);
            
        //  })
        //  .catch(function (err) {
        //     console.log('API call failed...');
        //     cb(err,null);
        //  });
    }

    getMetrics(sonar_config,component){
        console.log("GET Metrics for :"+ component);
        //Fetch API
        let COMPONENTID=component;
        let MetricApi=util.format(this.METRIC_API,component);
        
        var options = {
            uri: sonar_config.baseUrl+MetricApi,
        
            headers: {
            'User-Agent': 'Request-Promise',
            "Authorization" : sonar_config.auth    },
            json: true // Automatically parses the JSON string in the response
        };
    
        return rp(options);
        //     .then(function (metrics) {
        //     //console.log( components.components);
        //    cb(null,metrics.component.measures);
            
        //  })
        //  .catch(function (err) {
        //     console.log('API call failed...');
        //     cb(err,null);
        //  });
    }
}

module.exports=sonarClient



