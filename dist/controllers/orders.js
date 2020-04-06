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
const Order = require('../models/Order');
const Restuarent = require('../models/Restuarent');
//@desc  Create order
//@route POST /api/v1/restuarents/:restuarentId/orders
//@access Public
exports.createOrder = asyncHandler((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    req.body.restuarent = req.params.restuarentId;
    // req.body.user = req.user.id;
    const restuarent = yield Restuarent.findById(req.params.restuarentId);
    if (!restuarent) {
        return next(new ErrorResponse(`No restuarent with id of ${req.params.restuarentId}`, 404));
    }
    const order = yield Order.create(req.body);
    res.status(201).json({
        success: true,
        data: order
    });
}));
//@desc  Update order
//@route PUT /api/v1/orders/:orderId
//@access Public/Private
exports.updateOrder = asyncHandler((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let order = yield Order.findById(req.params.orderId);
    if (!order) {
        return next(new ErrorResponse(`No order with id of ${req.params.orderId}`, 404));
    }
    order = yield Order.findByIdAndUpdate(req.params.orderId, req.body, {
        new: true,
        runValidators: true
    });
    res.status(201).json({
        success: true,
        data: order
    });
}));
//@desc  Delete order
//@route DELETE /api/v1/orders/:orderId
//@access Private/Public(within time)
exports.deleteOrder = asyncHandler((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const order = yield Order.findById(req.params.orderId);
    if (!order) {
        return next(new ErrorResponse(`No order with id of ${req.params.orderId}`, 404));
    }
    //   //Make sure review belongs to user/admin
    //   if (review.user.toString() !== req.user.id && req.user.role !== "admin") {
    //     return next(new ErrorResponse(`Not authorised to update review`, 401));
    //   }
    yield order.remove();
    res.status(201).json({
        success: true,
        data: {}
    });
}));
//@desc  Add review
//@route POST /api/v1/orders/reviews/:orderId
//@access Public
exports.addReview = asyncHandler((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // req.body.user = req.user.id;
    let order = yield Order.findById(req.params.orderId);
    if (!order) {
        return next(new ErrorResponse(`No order with id of ${req.params.orderId}`, 404));
    }
    order = yield Order.findByIdAndUpdate(req.params.orderId, req.body, {
        new: true,
        runValidators: true
    });
    //Update the ratings after the review
    Order.getAvgMenuRating(order.menu);
    res.status(201).json({
        success: true,
        data: order
    });
}));
//@desc  Update review
//@route PUT /api/v1/orders/reviews/:orderId
//@access Public
exports.updateReview = asyncHandler((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let order = yield Order.findById(req.params.orderId);
    if (!order) {
        return next(new ErrorResponse(`No review with id of ${req.params.orderId}`, 404));
    }
    //   //Make sure review belongs to user/admin
    //   if (review.user.toString() !== req.user.id && req.user.role !== "admin") {
    //     return next(new ErrorResponse(`Not authorised to update review`, 401));
    //   }
    order = yield Order.findByIdAndUpdate(req.params.orderId, req.body, {
        new: true,
        runValidators: true
    });
    //Update the ratings after the review
    Order.getAvgMenuRating(order.menu);
    res.status(201).json({
        success: true,
        data: order
    });
}));
//@desc  Delete review
//@route DELETE /api/v1/orders/reviews/:orderId
//@access Private
exports.deleteReview = asyncHandler((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let order = yield Order.findById(req.params.orderId);
    if (!order) {
        return next(new ErrorResponse(`No order with id of ${req.params.orderId}`, 404));
    }
    //   //Make sure review belongs to user/admin
    //   if (review.user.toString() !== req.user.id && req.user.role !== "admin") {
    //     return next(new ErrorResponse(`Not authorised to update review`, 401));
    //   }
    order = yield Order.findByIdAndUpdate(req.params.orderId, {
        review: '',
        rating: ''
    }, {
        new: true,
        runValidators: true
    });
    //Update the ratings after the review
    Order.getAvgMenuRating(order.menu);
    res.status(201).json({
        success: true,
        data: order
    });
}));
//# sourceMappingURL=orders.js.map