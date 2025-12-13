const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const errorMiddleware = require("./middlewares/error");
const cors=require("cors");

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

app.use(cookieParser());
// Configure CORS
app.use(cors({
  origin: 'http://localhost:5173', // Replace with your frontend's actual URL/port
  credentials: true, // Allow cookies to be sent
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
}))

// const fileUpload = require('express-fileupload')
// app.use(fileUpload())

// Route Imports
const product = require("./routes/productRoutes");
const user=require("./routes/userRoute");
const order = require("./routes/orderRoute");
 const payment = require("./routes/paymentRoute");


app.use("/api/v1", product);
app.use("/api/v1",user);
app.use("/api/v1", order);
 app.use("/api/v1", payment);



// Middleware for Errors
app.use(errorMiddleware);



module.exports = app;

