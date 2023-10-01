const mongoose = require('mongoose')
const newsSchema = mongoose.Schema({

    message:{

        type:String,
        default:""
    },

    newBannerImagePath:{

        type:String,
        default:""
    },


})

const newsModel = mongoose.model("NewsModel",newsSchema)
module.exports = newsModel
