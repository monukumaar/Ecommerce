const Product = require("../models/productModel");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const ApiFeatures = require("../utils/apifeatures");
const cloudinary = require("cloudinary");

//upload avatar unsing streamfier
const streamifier = require("streamifier");

const uploadFromBuffer = (fileBuffer, folder = "products") => {
  return new Promise((resolve, reject) => {
    let cld_upload_stream = cloudinary.v2.uploader.upload_stream(
      {
        folder,
        resource_type: "auto", // image/video dono handle karega
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );

    // Buffer ko stream banao aur Cloudinary stream pe bhejo
    streamifier.createReadStream(fileBuffer).pipe(cld_upload_stream);
  });
};


// Create Product -- Admin


// In your controller:
exports.createProduct = catchAsyncErrors(async (req, res, next) => {
  // req.body contains other fields
  // req.files.images contains the uploaded file(s)
  // console.log(req.body);

  let productImages = req.body.images;

  // // Handle a single file vs. multiple files
  if (!Array.isArray(productImages)) {
    productImages = [productImages];
  }

  const imagesLinks = [];

  for (let i = 0; i < productImages.length; i++) {
    const result = await cloudinary.v2.uploader.upload(productImages[i], {
      folder: "products",
    });
    imagesLinks.push({
      public_id: result.public_id,
      url: result.secure_url,
    });
  }

  req.body.images = imagesLinks;
  req.body.user = req.user.id;

  const product = await Product.create(req.body);


  res.status(201).json({ success: true, product });
});
// Create Product -- Admin
// exports.createProduct = catchAsyncErrors(async (req, res, next) => {
//   let images = [];

//   console.log(req.body);
//     console.log(req.file);



//   if (typeof req.body.images === "string") {
//     images.push(req.body.images);
//   } else {
//     images = req.body.images;
//   }

//   const imagesLinks = [];

//   for (let i = 0; i < images.length; i++) {
//     const result = await cloudinary.v2.uploader.upload(images[i], {
//       folder: "products",
//     });

//     imagesLinks.push({
//       public_id: result.public_id,
//       url: result.secure_url,
//     });
//   }


//   req.body.images = imagesLinks;
//   req.body.user = req.user.id;
//   console.log(req.body);

//   const product = await Product.create(req.body);

//   res.status(201).json({
//     success: true,
//     product,
//   });
// });

// // Get All Product
// exports.getAllProducts = catchAsyncErrors(async (req, res) => {
//   const resultPerPage = 8;
//   const productsCount = await Product.countDocuments();

//   const apifeature = new ApiFeatures(Product.find(), req.query).search().filter().pagination(resultPerPage);

//   // console.log("hoi", apifeature.query);

//   let products = await apifeature.query;
//   let filteredProductsCount = products.length;


//   res.status(200).json({
//     success: true,
//     products,
//     productsCount,
//     resultPerPage,
//     filteredProductsCount
//   });
// })

exports.getAllProducts = catchAsyncErrors(async (req, res) => {
  const resultPerPage = 12;

  // --- Step 1: Get total count of products (without any filters) ---
  // This is typically for displaying the grand total
  const productsCount = await Product.countDocuments();

  // --- Step 2: Build the query for ALL filtered products (without pagination yet) ---
  // Create a new ApiFeatures instance specifically for counting filtered products
  const apiFeatureForCount = new ApiFeatures(Product.find(), req.query)
    .search()
    .filter();

  // Execute this query to get the count of products matching search/filters
  // We execute it by converting it to an array or just calling .countDocuments() on the filtered query
  const filteredProductsCount = await apiFeatureForCount.query.countDocuments();
  // OR if you need the actual length of the non-paginated result for some reason:
  // const allFilteredProducts = await apiFeatureForCount.query;
  // const filteredProductsCount = allFilteredProducts.length;

  // --- Step 3: Build the query for PAGINATED results ---
  // Create a NEW ApiFeatures instance or reset the query, and apply all features including pagination
  const apiFeatureForProducts = new ApiFeatures(Product.find(), req.query)
    .search()
    .filter()
    .pagination(resultPerPage);

  // --- Step 4: Execute the paginated query ONCE ---
  const products = await apiFeatureForProducts.query;

  res.status(200).json({
    success: true,
    products, // Paginated products
    productsCount, // Total products in DB
    resultPerPage,
    filteredProductsCount // Total products matching search/filters (before pagination)
  });
});

//  get  Product  Details
exports.getProductDetails = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return next(new ErrorHandler("product not found", 404))
  }

  res.status(200).json({
    success: true,
    product
  });
})
// Get All Product (Admin)
exports.getAdminProducts = catchAsyncErrors(async (req, res, next) => {
  const products = await Product.find();

  res.status(200).json({
    success: true,
    products,
  });
});

// Update Product -- Admin


// Update Product -- Admin
// Update Product -- Admin
exports.updateProduct = catchAsyncErrors(async (req, res, next) => {
  let product = await Product.findById(req.params.id);
//  console.log("Req Body:", req.body);
//  console.log("Req Files:", req.files);//array //expressupload
//    console.log("Req File:", req.file);//single// multer


  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  let imagesLinks = [];

  // 🟢 Agar new images bheji hain
  if (req.files && req.files.length > 0) {
  // Purani images delete
  for (let i = 0; i < product.images.length; i++) {
    await cloudinary.v2.uploader.destroy(product.images[i].public_id);
  }

  // Nayi images upload
  for (const file of req.files) {
    const result = await uploadFromBuffer(file.buffer, "products");

    imagesLinks.push({
      public_id: result.public_id,
      url: result.secure_url,
    });
  }

  req.body.images = imagesLinks;
} else {
  req.body.images = product.images;
}


  // ✅ Update product
  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
    product,
  });
});



// exports.updateProduct = catchAsyncErrors(async (req, res, next) => {
//   let product = await Product.findById(req.params.id);

//   if (!product) {
//     return next(new ErrorHandler("Product not found", 404));
//   }
//   console.log(req.body);

//   let pdtImages = req.body.images;

//   // // Handle a single file vs. multiple files
//   if (!Array.isArray(pdtImages)) {
//     pdtImages = [pdtImages];
//   }

//     // Deleting Images From Cloudinary
//     for (let i = 0; i < product.images.length; i++) {
//       await cloudinary.v2.uploader.destroy(product.images[i].public_id);
//     }

//     const imagesLinks = [];

//     for (let i = 0; i < pdtImages.length; i++) {
//       const result = await cloudinary.v2.uploader.upload(pdtImages[i], {
//         folder: "products",
//       });

//       imagesLinks.push({
//         public_id: result.public_id,
//         url: result.secure_url,
//       });
//     }

//     req.body.images = imagesLinks;
  

//   product = await Product.findByIdAndUpdate(req.params.id, req.body, {
//     new: true,
//     runValidators: true,
//     useFindAndModify: false,
//   });

//   res.status(200).json({
//     success: true,
//     product,
//   });
// });


//  DElete Product
exports.deleteProduct = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  // Deleting Images From Cloudinary
  for (let i = 0; i < product.images.length; i++) {
    await cloudinary.v2.uploader.destroy(product.images[i].public_id);
  }

  await Product.deleteOne();

  res.status(200).json({
    success: true,
    message: "Product Delete Successfully",
  });
});



// Create New Review or Update the review
exports.createProductReview = catchAsyncErrors(async (req, res, next) => {
  const { rating, comment, productId } = req.body;

  const review = {
    user: req.user._id,
    name: req.user.name,
    rating: Number(rating),
    comment,
  };

  const product = await Product.findById(productId);

  const isReviewed = product.reviews.find(
    (rev) => rev.user.toString() === req.user._id.toString()
  );

  if (isReviewed) {
    product.reviews.forEach((rev) => {
      if (rev.user.toString() === req.user._id.toString())
        (rev.rating = rating), (rev.comment = comment);
    });
  } else {
    product.reviews.push(review);
    product.numOfReviews = product.reviews.length;
  }

  let avg = 0;

  product.reviews.forEach((rev) => {
    avg += rev.rating;
  });

  product.ratings = avg / product.reviews.length;

  await product.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
  });
});

// Get All Reviews of a product
exports.getProductReviews = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.query.id);

  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  res.status(200).json({
    success: true,
    reviews: product.reviews,
  });
});

// Delete Review
exports.deleteReview = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.query.productId);

  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  const reviews = product.reviews.filter(
    (rev) => rev._id.toString() !== req.query.id.toString()
  );

  let avg = 0;

  reviews.forEach((rev) => {
    avg += rev.rating;
  });

  let ratings = 0;

  if (reviews.length === 0) {
    ratings = 0;
  } else {
    ratings = avg / reviews.length;
  }

  const numOfReviews = reviews.length;

  await Product.findByIdAndUpdate(
    req.query.productId,
    {
      reviews,
      ratings,
      numOfReviews,
    },
    {
      new: true,
      runValidators: true,
    }
  );


  res.status(200).json({
    success: true,
  });
});
