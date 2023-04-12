const Order = require('../models/Order');
const Product = require('../models/product');
const ErrorHandler = require('../Utils/errorHandler');
const catchAsyncErrors = require('../Middleware/catchasyncError');


//Create new Order
exports.createOrder = catchAsyncErrors(async(req,res,next)=>{

    const {shippingInfo,
           orderItems,
           paymentInfo,
           itemsPrice,
           taxPrice,
           shippingPrice,
           totalPrice, 
        } = req.body;

    const order = await Order.create({
        shippingInfo,
        orderItems,
        paymentInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice, 
        paidAt:Date.now(),
        user: req.user._id, 
    });    
    
    res.status(201).json({
        success:true,
        order,
    })
});

//Get Single Order Details
exports.getSingleOrder = catchAsyncErrors(async(req,res,next)=>{

    const order = await Order.findById(req.params.id).populate("user","name email");

    if(!order){
        return next(new ErrorHandler("Order not found with this Id ",404));
    }

    res.status(200).json({
        success:true,
        order,
    });
});

//Get Logged in Users Orders
exports.myOrders = catchAsyncErrors(async(req,res,next)=>{

    const orders = await Order.find({ user: req.user._id });
    

    if(!orders){
        return next(new ErrorHandler(`Order not found with this Id: ${_id}`,400))
    }
    res.status(200).json({
        success:true,
        orders,
    });
});

//Get All Orders --Admin
exports.getAllOrders = catchAsyncErrors(async(req,res,next)=>{
    const orders = await Order.find();
    
    
    if(!orders){
        return next(new ErrorHandler(`Order not found with this Id: ${_id}`,404))
    }
    let totalAmount = 0

    orders.forEach((order)=>{
        totalAmount += order.totalPrice;
    });

    res.status(200).json({
        success:true,
        totalAmount,
        orders,
    });
});

//Update Orders Status --Admin
exports.updateOrder = catchAsyncErrors(async (req, res, next) => {
    const order = await Order.findById(req.params.id);
  
    if (!order) {
      return next(new ErrorHandler("Order not found with this Id", 404));
    }
  
    if (order.orderStatus === "Delivered") {
      return next(new ErrorHandler("You have already delivered this order", 400));
    }
  
    if (req.body.status === "Shipped") {
        order.orderItems.forEach(async (o) => {
          await updateStock(o.product, o.quantity);
        });
      }
    order.orderStatus = req.body.status;
  
    if (req.body.status === "Delivered") {
      order.deliveredAt = Date.now();
    }
  
    await order.save({ validateBeforeSave: false });
    res.status(200).json({
      success: true,
    });
  });
  
  async function updateStock(id, quantity) {
    const product = await Product.findById(id);
  
    product.Stock=product.Stock -quantity;
  
    await product.save({ validateBeforeSave: false });
  }
  

//Delete Orders --Admin
exports.deleteOrders = catchAsyncErrors(async(req,res,next)=>{
    const order = await Order.findById(req.params.id);
    
    
    if(!order){
        return next(new ErrorHandler(`Order not found with this Id: ${_id}`,404))
    }

    await order.deleteOne()
    res.status(200).json({
        success:true,
    });
});