const mongoose = require('mongoose')

const url = 'mongodb://127.0.0.1:27017/KizilElmaTest'
mongoose.connect(url,{

    useNewUrlParser : true,
    useUnifiedTopology:true,

}).then(()=>{

    console.log('connection with database success'+process.pid)
})
    .catch((error)=>{

    console.log(error)
})