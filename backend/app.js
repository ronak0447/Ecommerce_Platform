const cookieParser = require("cookie-parser");
const express = require("express");
const connectDatabase = require("./config/database");
const app = express();
const errorMiddleware = require('./Middleware/Error');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const dotenv = require('dotenv');

//config
dotenv.config({path:"backend/config/config.env"});

app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended:true}));
app.use(fileUpload());
//Route Imports
const product = require("./routes/productRoute");
const order = require("./routes/orderRoute");
const user = require("./routes/UserRoute");
const payment = require("./routes/paymentRoutes");

app.use("/api" , product);
app.use("/api",  user);
app.use("/api", order);
app.use("/api",payment);

//Middleware for Errors
app.use(errorMiddleware);


module.exports = app;