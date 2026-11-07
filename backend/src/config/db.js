const { default: mongoose } = require("mongoose")
const config = require("./config")

const ConnectDb = async()=>{
    try {
        await mongoose.connect(config.MONGODB_URI)
        console.log("MongoDB running Successfully!")
    } catch (error) {
        console.log("Error in MongoDB")
    }
}

module.exports = ConnectDb