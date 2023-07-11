const express = require('express')
const app = new express()
const httpserver = require('http').Server(app)
const cluster = require('cluster')
const numofcpu = require('os').cpus().length

//require mongodb cpnnection
require('./DB/connection')

if (cluster.isPrimary){

    for (let i=0;i<numofcpu;i++){

        cluster.fork()
    }
}
else{


    httpserver.listen(app.get('port'),()=>{

        console.log(`server listening at port ${app.get('port')}`)
    })
}
