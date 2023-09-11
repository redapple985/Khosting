const mongoose = require('mongoose')
const interestSchema = mongoose.Schema({


    key:{

        type:String,
        default: ""
    },
    interestsOptions:{

        type:Array,
        default:[]
    }



})

const interesstOptionsModel = mongoose.model("userInterestOptions",interestSchema)
module.exports = interesstOptionsModel