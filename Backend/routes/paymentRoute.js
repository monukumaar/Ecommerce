const express = require("express");
const {
  processPayment,
  sendRazorpayApiKey,verifyPayment
} = require("../controllers/paymentController");
const router = express.Router();
const { isAuthenticatedUser } = require("../middlewares/auth");

router.route("/payment/process").post(isAuthenticatedUser, processPayment);

router.route("/razarpayapikey").get(isAuthenticatedUser, sendRazorpayApiKey);

router.route("/payment/verify").post( isAuthenticatedUser,verifyPayment);

module.exports = router;

