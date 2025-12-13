const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const Razorpay = require("razorpay");
const crypto = require("crypto");
const ErrorHandler = require("../utils/errorHandler");

// Validate Razorpay environment variables
if (!process.env.RAZORPAY_API_KEY || !process.env.RAZORPAY_SECRET_KEY) {
  throw new Error("Razorpay API key or secret key is missing");
}

const instance = new Razorpay({
  key_id: process.env.RAZORPAY_API_KEY,
  key_secret: process.env.RAZORPAY_SECRET_KEY,
});

exports.processPayment = catchAsyncErrors(async (req, res, next) => {
  const { amount } = req.body;

  // Validate amount (minimum ₹1 = 100 paise)
  if (!amount || isNaN(amount) || amount < 1) {
    return next(new ErrorHandler("Amount must be at least ₹1", 400));
  }

  // Convert amount from rupees to paise
const amountInPaise = Math.round(amount * 100); 
// Ensure amount is in paise
//const amountInPaise = 100

//  console.log("Creating order with amount (paise):", amountInPaise);

  try {
    const options = {
      amount: amountInPaise,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
      notes: {
        company: "Ecommerce",
      },
    };

    const order = await instance.orders.create(options);
    //console.log("Created order:", order);

    res.status(200).json({
      success: true,
      order: {
        id: order.id,
        amount: order.amount,
        currency: order.currency,
      },
    });
  } catch (error) {
    console.error("Order creation error:", error);
    return next(new ErrorHandler(`Failed to create order: ${error.message}`, 500));
  }
});

exports.sendRazorpayApiKey = catchAsyncErrors(async (req, res, next) => {
  res.status(200).json({ razorpayApiKey: process.env.RAZORPAY_API_KEY });
});

exports.verifyPayment = catchAsyncErrors(async (req, res, next) => {
  const { payment_id, order_id, signature } = req.body;

  // Validate request body
  if (!payment_id || !order_id || !signature) {
    return next(new ErrorHandler("Missing payment_id, order_id, or signature", 400));
  }

  const body = order_id + "|" + payment_id;
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_SECRET_KEY)
    .update(body.toString())
    .digest("hex");

//  console.log("Verifying payment:", { payment_id, order_id, expectedSignature, receivedSignature: signature });

  if (expectedSignature === signature) {
    res.status(200).json({ success: true });
  } else {
    return next(new ErrorHandler("Invalid signature", 400));
  }
});