const express = require('express');
const { registerUser,
        loginUser, 
        logout, 
        forgotPassword, 
        resetPassword, 
        getUserDetails, 
        updatePassword, 
        updateProfile, 
        getAlluser, 
        getSingleuser, 
        updateUserRole, deleteUser } = require('../controllers/userController');
const router = express.Router();
const {isAuthenticatedUser,authorizeRoles} = require('../Middleware/auth');


router.route("/register").post(registerUser);

router.route("/login").post(loginUser);

router.route("/forgot").post(forgotPassword);

router.route("/reset/:token").put(resetPassword);

router.route("/logout").get(logout);

router.route("/me").get(isAuthenticatedUser,getUserDetails);

router.route("/me/update").put(isAuthenticatedUser,updateProfile);

router.route("/changepassword").put(isAuthenticatedUser,updatePassword);

router.route("/admin/users").get(isAuthenticatedUser,authorizeRoles("admin"),getAlluser);

router.route("/admin/user/:id").get(isAuthenticatedUser,authorizeRoles("admin"),getSingleuser);

router.route("/admin/user/:id").put(isAuthenticatedUser,authorizeRoles("admin"),updateUserRole);

router.route("/admin/user/:id").delete(isAuthenticatedUser,authorizeRoles("admin"),deleteUser);

module.exports = router;