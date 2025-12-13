const express = require("express");
const router = express.Router();
const { getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductDetails,
  createProductReview,
  getProductReviews,
  deleteReview,
  getAdminProducts } = require('../controllers/productControllers');
const { isAuthenticatedUser, authorizeRoles } = require("../middlewares/auth");

const upload = require("../middlewares/multer"); // import multer config


router.route("/products").get( getAllProducts);


router
  .route("/admin/products")
  .get(isAuthenticatedUser, authorizeRoles("admin"), getAdminProducts);

// router.get(getAllProducts);
router.route("/admin/product/new").post(isAuthenticatedUser, authorizeRoles("admin"), createProduct);

router.route("/admin/product/:id").put(isAuthenticatedUser, authorizeRoles("admin"),  upload.array("images", 5), // max 5 images
 updateProduct)

  router.route("/admin/product/:id").delete(isAuthenticatedUser, authorizeRoles("admin"), deleteProduct)


router.route("/product/:id").get(getProductDetails);

router.route("/review").put(isAuthenticatedUser, createProductReview);

router
  .route("/reviews")
  .get(getProductReviews)
  .delete( deleteReview);


module.exports = router;
