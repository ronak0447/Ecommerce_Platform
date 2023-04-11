const catchasyncError = require("../Middleware/catchasyncError");

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
//Proccessing Payment
exports.proccessPayment = catchasyncError(async(req,res,next)=>{
    const myPayment = await stripe.paymentIntents.create({
        amount: req.body.amount,
        currency: "inr",
        metadata:{
            company:"Ecommerce",
        },
    });
    res.status(200).json({ success: true , client_secret:myPayment.client_secret});
});

//Send StripeApiKey
exports.sendStripeApiKey = catchasyncError(async(req,res,next)=>{
    res.status(200).json({stripeApiKey: process.env.STRIPE_API_KEY});
});