const app = require("./app")
const dotenv = require('dotenv')
const connectDatabase = require ('./config/database')
const cloudinary = require('cloudinary')

//Handling Uncaught Exception
process.on("uncaughtException",(err)=>{
    console.log(`Error: ${err.message}`);
    console.log("Shutting down the server due to Uncaught Exception");
    process.exit(1);
    
}); 

//config
dotenv.config({path:"backend/config/config.env"});

//connecting database
connectDatabase()

cloudinary.config({
    cloud_name: "dkvvtpgvf",
    api_key:"391616124885177",
    api_secret:"apAKpi3upSj0zZ6iMTDK4rtACOE",
});

const server = app.listen(process.env.PORT,()=>{
    console.log(`Ecommerce app is running on http://localhost${process.env.PORT}`)
});


//Unhandled Promise Rejection
process.on('unhandledRejection',err=>{
    console.log(`Error: ${err.message}`);
    console.log("Shutting down the server due to Unhandled Promise Rejection");
    server.close(()=>{
        process.exit(1);
    });
});