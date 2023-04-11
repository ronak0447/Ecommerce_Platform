const ErrorHandler = require("../Utils/errorHandler");
const catchasyncError = require("./catchasyncError");
const JWT_TOKEN = require('jsonwebtoken');
const User = require("../models/User");
const JWT_SECRET = "Ronakisgoodg$uy";


exports.isAuthenticatedUser = catchasyncError(async(req,res,next)=>{

    const {token} = req.cookies;

   if(!token){
    return next(new ErrorHandler("Please Login to access this resource",401))
   }
   const decodedData = JWT_TOKEN.verify(token,JWT_SECRET)

  req.user = await User.findById(decodedData.id);

  next();
});

exports.authorizeRoles = (...roles)=>{
    return (req,res,next)=>{
        if(!roles.includes(req.user.role)){
        return next (new ErrorHandler(
            `Role: ${req.user.role} is not allowed to access this resource`,403,
            )
        );
    }
        next();

    };

};