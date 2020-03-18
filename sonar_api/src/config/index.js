
const port=8080

module.exports = function(){
    switch(process.env.NODE_ENV){
        case 'development':
            return port;

        case 'production':
            return prodport;

        default:
            return port;
    }
};