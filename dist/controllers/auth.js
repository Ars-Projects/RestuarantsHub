"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const User = require('../models/User');
const crypto = require('crypto');
const sendEmail = require('../utils/sendEmail');
//@desc  Register user
//@route POST /api/v1/auth/register
//@access Public
exports.register = asyncHandler((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, role, password, address } = req.body;
    //create user
    const user = yield User.create({
        name,
        email,
        role,
        password,
        address
    });
    sendTokenResponse(user, 200, res);
}));
//@desc  Login user
//@route POST /api/v1/auth/login
//@access Public
exports.login = asyncHandler((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    //validate email and password
    if (!email || !password) {
        return next(new ErrorResponse("Please provide an email and password", 400));
    }
    // check for user
    const user = yield User.findOne({ email }).select("+password");
    if (!user) {
        return next(new ErrorResponse("Invalid credentials", 401));
    }
    //check if password matches
    const isMatch = yield user.matchPassword(password);
    if (!isMatch) {
        return next(new ErrorResponse("Invalid credentials", 401));
    }
    sendTokenResponse(user, 200, res);
}));
//@desc  Get current Login user
//@route POST /api/v1/auth/me
//@access Private
exports.getMe = asyncHandler((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield User.findById(req.user.id);
    res.status(200).json({
        success: true,
        data: user
    });
}));
//@desc  Update user details
//@route PUT /api/v1/auth/updatedetails
//@access Private
exports.updateDetails = asyncHandler((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const fieldsToUpdate = {
        name: req.body.name,
        email: req.body.email
    };
    const user = yield User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
        new: true,
        runValidators: true
    });
    res.status(200).json({
        success: true,
        data: user
    });
}));
//@desc  Update password
//@route PUT /api/v1/auth/updatepassword
//@access Private
exports.updatePassword = asyncHandler((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield User.findById(req.user.id).select("+password");
    //Check current password
    if (!(yield user.matchPassword(req.body.currentPassword))) {
        return next(new ErrorResponse("Password is incorrect", 401));
    }
    user.password = req.body.newPassword;
    yield user.save();
    sendTokenResponse(user, 200, res);
}));
//@desc  Forgot Password
//@route POST /api/v1/auth/forgotpassword
//@access Public
exports.forgotPassword = asyncHandler((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield User.findOne({ email: req.body.email });
    if (!user) {
        return next(new ErrorResponse("There is no user with that email", 404));
    }
    //Get reset token
    const resetToken = user.getResetPasswordToken();
    yield user.save({ validateBeforeSave: false });
    // Create reset URL
    const resetUrl = `${req.protocol}://${req.get("host")}/api/v1/auth/resetPassword/${resetToken}`;
    const message = `You are receiving this email because you (or someone else) has requested the reset of a password. 
  Please make a PUT request to: \n\n ${resetUrl}`;
    try {
        yield sendEmail({
            email: user.email,
            subject: "Password reset token",
            message
        });
        res.status(200).json({ success: true, data: "Email sent" });
    }
    catch (err) {
        console.log(err);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        yield user.save({ validateBeforeSave: false });
        return next(new ErrorResponse("Email could not be sent", 500));
    }
}));
// @desc      Reset password
// @route     PUT /api/v1/auth/resetpassword/:resettoken
// @access    Public
exports.resetPassword = asyncHandler((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // Get hashed token
    const resetPasswordToken = crypto
        .createHash("sha256")
        .update(req.params.resettoken)
        .digest("hex");
    const user = yield User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() }
    });
    if (!user) {
        return next(new ErrorResponse("Invalid Token", 400));
    }
    //Set new password
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    yield user.save();
    sendTokenResponse(user, 200, res);
}));
//@desc  Log user out/clear cookie
//@route GET /api/v1/auth/logout
//@access Private
exports.logout = asyncHandler((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    res.cookie("token", "none", {
        expires: new Date(Number(Date.now) + 10 * 1000),
        httpOnly: true
    });
    res.status(200).json({
        success: true,
        data: {}
    });
}));
// Get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
    //create token
    const token = user.getSignedJwtToken();
    const options = {
        expires: new Date(Date.now() + Number(process.env.JWT_COOKIE_EXPIRE) * 24 * 60 * 60 * 1000),
        httpOnly: true,
        secure: false
    };
    if (process.env.NODE_ENV === "production") {
        options.secure = true;
    }
    res
        .status(statusCode)
        .cookie("token", token, options)
        .json({
        success: true,
        token
    });
};
//# sourceMappingURL=auth.js.map