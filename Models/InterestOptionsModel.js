const mongoose = require('mongoose')
const interestSchema = mongoose.Schema({


    key:{

        type:String,
        default: ""
    },
    interestsOptions:{

        type:Array,
        default:[]
    },

    adminName:{
        type:String,
        default:""
    },

    adminIp:{
        type:String,
        default:""
    },
    adminlocationCoordinates:{
        type:String,
        default:""
    },

    Added:{
        type:String,
        default:""
    }



})

const interesstOptionsModel = mongoose.model("userInterestOptions",interestSchema)
module.exports = interesstOptionsModel