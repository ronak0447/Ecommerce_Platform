const express = require('express');
const { createOrder, getSingleOrder, myOrders, getAllOrders, updateOrder, deleteOrders } = require('../controllers/orderController');
const {isAuthenticatedUser,authorizeRoles} = require('../Middleware/auth');

const router = express.Router();

router.route("/order/new").post(isAuthenticatedUser,createOrder);

router.route("/order/:id").get(isAuthenticatedUser,getSingleOrder);

router.route("/myorder").get(isAuthenticatedUser,myOrders);

router.route("/admin/orders").get(isAuthenticatedUser,authorizeRoles("admin"),getAllOrders);

router.route("/admin/order/:id")
.put(isAuthenticatedUser,authorizeRoles("admin"),updateOrder)
.delete(isAuthenticatedUser,authorizeRoles("admin"),deleteOrders);


module.exports = router;