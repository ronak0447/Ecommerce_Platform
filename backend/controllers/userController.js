const ErrorHandler = require('../Utils/errorHandler');
const catchAsyncErrors = require('../Middleware/catchasyncError');
const User = require('../models/User');
const sentToken = require('../Utils/jwttoken');
const sendEmail = require('../Utils/sendEmail');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const cloudinary = require('cloudinary');
const FRONTEND_URL = "http://localhost:3000";

//Register
exports.registerUser = catchAsyncErrors(async (req, res, next) => {

    const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar,{
        folder:"avatars",
        width: 150,
        crop: "scale",
    });

    const { name, email, password } = req.body;

    const user = await User.create({
        name, email, password,
        avatar: {
            public_id:myCloud.public_id,
            url: myCloud.secure_url
        }
    });
    sentToken(user, 201, res);

});

//Loogin User
exports.loginUser = catchAsyncErrors(async (req, res, next) => {
    const { email, password } = req.body;

    //checking if user has given password and mail both
    const user = await User.findOne({ email }).select("+password")

    if (!user) {
        success = false;
        return next(new ErrorHandler("Invalid email & password", 401));
    }

    const isPasswordMatched = await bcrypt.compare(password, user.password);

    if (!isPasswordMatched) {
        return next(new ErrorHandler("Invalid email & password", 401));
    }
    sentToken(user, 200, res);

});

//LogOut User
exports.logout = catchAsyncErrors(async (req, res, next) => {
    const userId = req.body.id
    const user = await User.findById(userId).select("-password")
    res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true,
    });


    res.status(200).json({
        success: true,
        user,
        message: "Logout Successfully"
    });
});

// Forgot Password 
exports.forgotPassword = catchAsyncErrors(async (req, res, next) => {

    const user = await User.findOne({ email: req.body.email });

    if (!user) {
        return next(new ErrorHandler("User not found", 404));
    }

    //Get ResetPAssword Token\
    const resetToken = user.getResetPasswordToken();

    await user.save({ validateBeforeSave: false });

    const resetPasswordUrl = `${req.protocol}://${req.get("host")}/reset/${resetToken}`;

    const message = `Your Password reset token is :- \n\n ${resetPasswordUrl} \n\n If you have not requested this email then, ignore it.`;

    try {

        await sendEmail({
            email: user.email,
            subject: `Ecommerce Password Recovery`,
            message,
        });

        res.status(200).json({
            success: true,
            message: `Email Sent to ${user.email} Successfully`,
        })

    } catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save({ validateBeforeSave: false });
        return next(new ErrorHandler(error.message, 500));
    }


});


//Reset Password
exports.resetPassword = catchAsyncErrors(async (req, res, next) => {
    const resetPasswordToken = crypto
        //Creating Token Hash
        .createHash("sha256")
        .update(req.params.token)
        .digest("hex");
    const {newpassword,confirmpassword} = req.body
    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
        return next(new ErrorHandler("Reset Password Token is invalid or has been expired", 400));
    }
    console.log(req.body)
    console.log(req.body.confirmpassword)
    if (newpassword !== confirmpassword) {
        return next(new ErrorHandler("Password does not match", 400));
    }
    if(newpassword == confirmpassword){
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(newpassword, salt);
    await User.findByIdAndUpdate(user, { password: hashedPassword });
}

    // user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    // await user.save();

    sentToken(user, 200, res);
});

// Get User Details
exports.getUserDetails = catchAsyncErrors(async (req, res, next) => {

    const user = await User.findById(req.user.id);

    res.status(200).json({
        success: true,
        user,
    });

});


// Update User Password
exports.updatePassword = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.user.id).select("+password");
    const { oldpassword,newpassword} = req.body
    const isPasswordMatched = await bcrypt.compare(oldpassword,user.password);

    if (!isPasswordMatched) {
        return next(new ErrorHandler("Old Password is incorrect", 401));
    }
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(newpassword, salt);
    await User.findByIdAndUpdate(req.user.id, { password: hashedPassword });
    res.status(200).json({
        success:true,
        message:"Password Updated Succefully",
    })

});

//Update User Profile 
exports.updateProfile = catchAsyncErrors(async (req, res, next) => {

    const newUserData = {
        name: req.body.name,
        email: req.body.email
    }

    if(req.body.avatar !==""){
        const user = await User.findById(req.user.id);

        const imageId = user.avatar.public_id;

        await cloudinary.v2.uploader.destroy(imageId);

        const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar,{
            folder:"avatars",
            width: 150,
            crop: "scale",
        });
        newUserData.avatar ={
            public_id:myCloud.public_id,
            url: myCloud.secure_url,
        }
    }

    const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
        new: true,
        runValidators: true,
        useFindAndModify: true,
    });

    res.status(200).json({
        success: true,

    })
});

//Get All Users
exports.getAlluser = catchAsyncErrors(async (req, res, next) => {

    const users = await User.find();

    res.status(200).json({
        success: true,
        users,
    });
});

//Get Single Users---(Admin)
exports.getSingleuser = catchAsyncErrors(async (req, res, next) => {

    const user = await User.findById(req.params.id);

    if (!user) {
        return next(new ErrorHandler(`User does not exist with id: ${req.params.id}`));
    };

    res.status(200).json({
        success: true,
        user,
    });
});

//Update User Profile/Role --(ADMIN)
exports.updateUserRole = catchAsyncErrors(async (req, res, next) => {

    const newUserData = {
        name: req.body.name,
        email: req.body.email,
        role: req.body.role,
    }

    // let user = await User.findById(req.params.id);
    // if (!user) {
    //     return next (
    //         new ErrorHandler(`User does not exixt with id: ${req.params.id}`),400
    //     );
    // }

     await User.findByIdAndUpdate(req.params.id, newUserData, {
        new: true,
        runValidators: true,
        useFindAndModify: true,
    });

    res.status(200).json({
        success: true,
    });
});


//Delete User --(ADMIN) 
exports.deleteUser = catchAsyncErrors(async (req, res, next) => {

    const user = await User.findById(req.params.id);

    if(!user){
        return next(new ErrorHandler(`User does not exist with id: ${req.params.id}`)
        );
    }
    const imageId = user.avatar.public_id;

    await cloudinary.v2.uploader.destroy(imageId);
    await user.deleteOne();

    res.status(200).json({
        success: true,
        message:"user deleted succefully",
    });
});