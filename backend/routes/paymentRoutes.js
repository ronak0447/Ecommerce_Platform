const express = require('express');
const router = express.Router();
const {isAuthenticatedUser} = require('../Middleware/auth');
const { proccessPayment, sendStripeApiKey } = require('../controllers/paymentControllers');


router.route("/payment/proccess").post(isAuthenticatedUser,proccessPayment);

router.route("/stripeapikey").get(isAuthenticatedUser,sendStripeApiKey);

module.exports = router;