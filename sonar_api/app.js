const express = require('express');
const api = require('./src/api');
const  mongoManager  = require('./src/mongo');
var mongoose=require('mongoose');
dburl=require('./src/config/dbconfig')

//Application
const app = express();

//Establish Database Connection
mongoManager();

// api routes v1
app.use('/api/v1', api);


module.exports = app;
