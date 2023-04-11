const mongoose = require("mongoose")
const mongoURI = "mongodb+srv://ronakscriptjet:N7Co5ypzzfJAJGB5@clusterronak.dyv6ke7.mongodb.net/Ecommerce"
const connectDatabase = async()=>{
 await  mongoose.connect(mongoURI).then(()=>{
        console.log("Mongodb Connected with server");
    })
};

module.exports = connectDatabase;