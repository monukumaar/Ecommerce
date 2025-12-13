const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const User = require("../models/userModel");
const sendToken = require("../utils/jwtToken");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");
const cloudinary = require("cloudinary");
const { log } = require("console");



// Utility function to handle avatar uploads //  for base64 in string
// const uploadAvatar = async (avatar, defaultAvatar = "/Profile.png") => {

//   if (!avatar || avatar === defaultAvatar) {
//     return {
//       public_id: "default_avatar",
//         url: defaultAvatar,
//     };
//   }

//   const uploadConfig = {
//     folder:"avatar",
//     width: 150,
//     crop: "scale",
//   };


// console.log("Upload config:", uploadConfig);
// const result = await cloudinary.uploader.upload(avatar, uploadConfig);
// console.log("Upload result:", result);



//   return {
//     public_id: result.public_id,
//     url: result.secure_url,
//   };
// };


// multer for buffer,memorystorage
const uploadAvatar = (buffer, defaultAvatar = "/Profile.png") => {

  if (!buffer) {
    return {
      public_id: "default_avatar",
      url: defaultAvatar,
    };
  }
  return new Promise((resolve, reject) => {
    if (!buffer) {
      return resolve({
        public_id: "default_avatar",
        url: defaultAvatar,
      });
    }

    const uploadConfig = {
      folder: "avatar",
      width: 150,
      crop: "scale",
    };

    const stream = cloudinary.v2.uploader.upload_stream(uploadConfig, (err, result) => {
      if (err) return reject(err);
      resolve({
        public_id: result.public_id,
        url: result.secure_url,
      });
    });

    stream.end(buffer); // buffer ko stream me bhejo
  });
};


// Register User  // multer for buffer,memorystorage

exports.registerUser = catchAsyncErrors(async (req, res, next) => {

  // console.log("body",req.body);
  //    console.log("file",req.file);// multer
  //  console.log("files",req.files);// express-fileupload


  const { name, email, password } = req.body;
  // Agar file nahi bheji to buffer undefined hoga
    const avatarbuffer = req.file? req.file.buffer : null;//multer
//  const avatarbuffer = req.files ? req.files.avatar.data : null;//express-fileupload
  // Check if user already exists
  let user = await User.findOne({ email });
  //console.log("user", user);

  if (user) {
    return res.status(200).json({
      success: false,
      message: "Email already registered. Please login instead.",
    });
  }


  //  console.log("📥 Register request body:", req.body);

  //Handle avatar upload
  const avatardata = await uploadAvatar(avatarbuffer, "/Profile.png");



  //  console.log("✅ Cloudinary uploaded:", avatardata);

  //Create user
  user = await User.create({
    name,
    email,
    password,
    avatar: avatardata,
  });

  // console.log("✅ User created in DB:", user);

  sendToken(user, 201, res);
});
// // Register User //  for base64 in string
// exports.registerUser = catchAsyncErrors(async (req, res, next) => {

//   console.log(req.body);
//    // console.log(req.file);


//   const { name, email, password, avatar } = req.body;


//       // Check if user already exists
//     let user = await User.findOne({ email });
//     console.log("user",user);

//     if (user) {
//       return res.status(200).json({
//         success: false,
//         message: "Email already registered. Please login instead.",
//       });
//     }


// //  console.log("📥 Register request body:", req.body);

//   // Handle avatar upload
//   const avatardata = await uploadAvatar(avatar);

//   console.log(avatardata);


//   console.log("✅ Cloudinary uploaded:", avatardata);

//   //Create user
//    user = await User.create({
//     name,
//     email,
//     password,
//     avatar: avatardata,
//   });

//  console.log("✅ User created in DB:", user);

//   sendToken(user, 201, res);
// });

// Update User Profile
exports.updateProfile = catchAsyncErrors(async (req, res, next) => {

  const { name, email, avatar } = req.body;
  //console.log(req.body);
  

  // Prepare updated data
  const newUserData = { name, email };

  // Find the user
  const user = await User.findById(req.user.id);
  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  // Handle avatar upload if provided
  if (avatar && avatar !== user.avatar.url) {
    // Delete old avatar from Cloudinary if it exists and is not the default
    if (user.avatar.public_id && user.avatar.public_id !== "default_avatar") {
      await cloudinary.uploader.destroy(user.avatar.public_id);
    }

    // Upload new avatar
    newUserData.avatar = await uploadAvatar(avatar);
  }

  // Update user
  const updatedUser = await User.findByIdAndUpdate(req.user.id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
    user: updatedUser,
  });
});

// Login User
exports.loginUser = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;
  // console.log(email, password);

  // checking if user has given password and email both

  if (!email || !password) {
    return next(new ErrorHandler("Please Enter Email & Password", 400));
  }

  const user = await User.findOne({ email }).select("+password"); // .select("+password") is often needed if password field is excluded by default  console.log(user);
  //console.log(user);

  if (!user) {
    return next(new ErrorHandler("Invalid email or passwords", 200));//401
  }

  const isPasswordMatched = await user.comparePassword(password);

  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid email or password", 200));//401
  }
  //console.log(isPasswordMatched, user);

  sendToken(user, 200, res);

});

// Logout User
exports.logout = catchAsyncErrors(async (req, res, next) => {
  res.clearCookie("token", {
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: "Logged Out",
  });
});

// Forgot Password
exports.forgotPassword = catchAsyncErrors(async (req, res, next) => {

  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new ErrorHandler("User not found", 200));
  }

  // Get ResetPassword Token
  const resetToken = user.getResetPasswordToken();

  await user.save({ validateBeforeSave: false });

  const resetPasswordUrl = `${process.env.FRONTEND_URL}/password/reset/${resetToken}`;


  const message = `Your password reset token is  :- \n\n ${resetPasswordUrl} \n\nIf you have not requested this email then, please ignore it.`;

  try {
    await sendEmail({
      email: user.email,
      subject: `Ecommerce Password Recovery`,
      message,
    });

    res.status(200).json({
      success: true,
      message: `Email sent to ${user.email} successfully`,
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save({ validateBeforeSave: false });

    return next(new ErrorHandler(error.message, 500));
  }
});



// Reset Password
exports.resetPassword = catchAsyncErrors(async (req, res, next) => {
  // creating token hash

  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });


  if (!user) {
    return next(
      new ErrorHandler(
        "Reset Password Token is invalid or has been expired",
        400
      )
    );
  }

  if (req.body.password !== req.body.confirmPassword) {
    return next(new ErrorHandler("Password does not match ", 400));
  }

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;


  await user.save();

  sendToken(user, 200, res);
});

// Get User Detail
exports.getUserDetails = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    user,
  });
});


// update User password
exports.updatePassword = catchAsyncErrors(async (req, res, next) => {

  const user = await User.findById(req.user.id).select("+password");

  const isPasswordMatched = await user.comparePassword(req.body.oldPassword);

  if (!isPasswordMatched) {
    return next(new ErrorHandler("Old password is incorrect", 200));
  }

  if (req.body.newPassword !== req.body.confirmPassword) {
    return next(new ErrorHandler("password does not match", 200));
  }

  user.password = req.body.newPassword;

  await user.save();

  sendToken(user, 200, res);
});





// Get all users(admin)
exports.getAllUser = catchAsyncErrors(async (req, res, next) => {
  const users = await User.find();

  res.status(200).json({
    success: true,
    users,
  });
});

// Get single user (admin)
exports.getSingleUser = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(
      new ErrorHandler(`User does not exist with Id: ${req.params.id}`)
    );
  }

  res.status(200).json({
    success: true,
    user,
  });
});



// update User Role -- Admin
exports.updateUserRole = catchAsyncErrors(async (req, res, next) => {
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
    role: req.body.role,
  };

  await User.findByIdAndUpdate(req.params.id, newUserData, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
  });
});

// Delete User --Admin
exports.deleteUser = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(
      new ErrorHandler(`User does not exist with Id: ${req.params.id}`, 400)
    );
  }

  // const imageId = user.avatar.public_id;

  // await cloudinary.v2.uploader.destroy(imageId);

  await user.deleteOne(); // ✅ Best replacement for `remove()`

  res.status(200).json({
    success: true,
    message: "User Deleted Successfully",
  });
});
