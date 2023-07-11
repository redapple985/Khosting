const mongoose = require('mongoose')

const url = ''
mongoose.connect(url,{

    useNewUrlParser : true,
    useUnifiedTopology:true,

}).then(()=>{

    console.log('connection with database success')
})
    .catch((error)=>{

    console.log(error)
})