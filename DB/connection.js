const mongoose = require('mongoose')

const url = process.env.DEVMODE_LOCAL

const enviromentTesturl = process.env.DEVMODE_REMOTE
mongoose.connect(enviromentTesturl,{

    useNewUrlParser : true,
    useUnifiedTopology:true,

}).then(()=>{

    console.log('connection with database success'+process.pid)
    console.log(url)
})
    .catch((error)=>{

    console.log(error)
})
