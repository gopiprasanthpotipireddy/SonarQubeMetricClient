const username= "admin";
const password ="admin";
const server="http://localhost:9000"

module.exports={
    baseUrl :"http://localhost:9000/",
    auth : "Basic " + new Buffer.from(username + ":" + password).toString("base64"),
    server:server
 }