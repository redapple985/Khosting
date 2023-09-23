const mongoose = require('mongoose')
const dashboardSchema = mongoose.Schema({


    userId:{

        type:String,
        default:""
    },

    userName:{
        type:String,
        default: ""
    },

    title:{

        type:String,
        default:""
    },

    subtext:{

        type:String,
        default:""
    },

    timeStamp:{

        type:String,
        default:""
    },

    description:{
        type:String,
        default:""
    },

    InterestCatagory:{
        type:String,
        default:""
    },

    Type:{

        type:String,
        default:""
    },

    discussionId:{

        type:String,
        default:""
    },

    status:{

        type:String,
        default:""
    },

    winner:{

        type:String,
        default:""
    },

    mediaImagePath:{
        type:String,
        default:""

    },

    mediaVideoPath:{

        type:String,
        default:""
    }




})


const dashboardModel = mongoose.model("dashboardModel",dashboardSchema)
module.exports = dashboardModel