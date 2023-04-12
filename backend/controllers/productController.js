const Product = require('../models/product');
const ErrorHandler = require('../Utils/errorHandler');
const catchAsyncErrors = require('../Middleware/catchasyncError');
const ApiFeatures = require('../Utils/ApiFeatures');

//Create Product -- Admin Route
exports.createProduct = catchAsyncErrors(async (req, res, next) => {
    req.body.user = req.user.id

    const product = await Product.create(req.body);
    res.status(201).json({
        success: true,
        product
    });

});


//Get All Products
exports.getAllproducts = catchAsyncErrors(async (req, res,next) => {
    const resultPerPage = 8;
    const productsCount = await Product.countDocuments();

    const apiFeature = new ApiFeatures(Product.find(), req.query)
        .search()
        .filter()
        
        let products = await apiFeature.query;
        
        let filterdProductsCount = products.length;
        apiFeature.pagination(resultPerPage);

        products = await apiFeature.query.clone();

    res.status(200).json({
        success: true,
        products,
        productsCount,
        resultPerPage,
        filterdProductsCount,
    });
});
//Get All Products (Admin)
exports.getAdminproducts = catchAsyncErrors(async (req, res,next) => {
    const products = await Product.find();

    res.status(200).json({
        success: true,
        products,
    });
});

//Update Products -- Admin Route
exports.updateProduct = async (req, res, next) => {
    let product = await Product.findById(req.params.id);

    if (!product) {
        return next(new ErrorHandler("Product Not Found", 404));
    }

    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidator: true,
        useFindAndModify: false
    });
    res.status(200).json({
        success: true,
        product
    })
}

//Get Product Details
exports.getProductDetails = catchAsyncErrors(async (req, res, next) => {
    const product = await Product.findById(req.params.id);

    if (!product) {
        return next(new ErrorHandler("Product Not Found", 404));
    }

    res.status(200).json({
        success: true,
        product,
    });
});



//Delete Product 
exports.deleteProduct = catchAsyncErrors(async (req, res, next) => {

    let product = await Product.findById(req.params.id);

    if (!product) {
        return next(new ErrorHandler("Product Not Found", 404));
    }

    product = await Product.findByIdAndDelete(req.params.id);
    res.status(200).json({
        success: true,
        message: "Product was deleted successfully"
    });
});

//Create New Review or Update the review

exports.createProductReview = catchAsyncErrors(async (req, res, next) => {
    const { rating, comment, productId } = req.body

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

//Get All Reviews of a Product
exports.getProductReviews = catchAsyncErrors(async(req,res,next)=>{

    const product = await Product.findById(req.query.id);

    if(!product){
        return next(new ErrorHandler("Product not found",404));
    }

    res.status(200).json({
        success:true,
        reviews: product.reviews,
    })
});

//Delete Reviews of Product
exports.deleteProductReviews = catchAsyncErrors(async(req,res,next)=>{

    const product = await Product.findById(req.query.productId);

    if(!product){
        return next(new ErrorHandler("Product not found",404));
    }

    const reviews = product.reviews.filter(
        (rev)=> rev._id.toString() !== req.query.id.toString()
    );

    let avg = 0;

    product.reviews.forEach((rev) => {
        avg += rev.rating;
    });

    let ratings = 0;

    if (reviews.length === 0) {
        ratings = 0;
      } else {
        ratings = avg / reviews.length;
      }
    const numOfReviews = reviews.length;

    await Product.findByIdAndUpdate(req.query.productId,{
        reviews,
        ratings,
        numOfReviews,
    },
    {
        new:true,
        runValidators:true,
        useFindAndModify:false,
    }
    );
    res.status(200).json({
        success:true,
        message:"review deleted successfully",
    })
});
