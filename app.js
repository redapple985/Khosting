const express = require('express')
const app = new express()
const httpserver = require('http').Server(app)
const cluster = require('cluster')
const numofcpu = require('os').cpus().length
const userRoutes =require("./Routes/userRoutes")
const helmet = require('helmet')
require('dotenv').config()
app.use(express.static(__dirname));

//require mongodb cpnnection
require('./DB/connection')

//app settings
app.set('port',process.env.port||5000)

//Middlewares
app.use("/baseapp/user",userRoutes)
app.use(helmet())
app.use(express.json())



if (process.env.isdevelopment==='development') {

    httpserver.listen(app.get('port'), () => {

        console.log(`server listening at port ${app.get('port')} with process id` + process.pid+"in development mode")
    })



}
else{

    if (cluster.isPrimary) {

        for (let i = 0; i < numofcpu; i++) {

            cluster.fork()
        }
    } else {


        httpserver.listen(app.get('port'), () => {

            console.log(`server listening at port ${app.get('port')} with process id` + process.pid)
        })
    }

}
