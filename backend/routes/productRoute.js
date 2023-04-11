const express = require('express');
const { getAllproducts,
        createProduct, 
        updateProduct, 
        deleteProduct, 
        getProductDetails, createProductReview, getProductReviews, deleteProductReviews } = require('../controllers/productController');
const {isAuthenticatedUser,authorizeRoles} = require('../Middleware/auth');

const router= express.Router()

router.route("/products").get(getAllproducts);

router.route("/admin/addproduct").post(isAuthenticatedUser,authorizeRoles("admin"),createProduct);

router.route("/admin/update/:id").put(isAuthenticatedUser,authorizeRoles("admin"),updateProduct);

router.route("/admin/delete/:id").delete(isAuthenticatedUser,authorizeRoles("admin"),deleteProduct);

router.route("/details/:id").get(getProductDetails);

router.route("/review").put(isAuthenticatedUser,createProductReview);

router.route("/productreview").get(getProductReviews);

router.route("/productreview/delete").delete(isAuthenticatedUser,deleteProductReviews);


module.exports = router