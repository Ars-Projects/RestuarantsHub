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
//@desc  Get All users
//@route GET /api/v1/users
//@access Private/Admin
// exports.getUsers = asyncHandler(async (req, res, next) => {
//   res.status(200).json(res.advancedResults);
// });
//@desc  Get single user
//@route GET /api/v1/users/:userId
//@access Private/Admin
exports.getUser = asyncHandler((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield User.findById(req.params.userId);
    res.status(200).json({
        success: true,
        data: user
    });
}));
//@desc  Create user
//@route POST /api/v1/auth/users
//@access Private/Admin
exports.createUser = asyncHandler((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield User.create(req.body);
    res.status(201).json({
        success: true,
        data: user
    });
}));
//@desc  Update user
//@route PUT /api/v1/auth/users/:userId
//@access Private/Admin
exports.updateUser = asyncHandler((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield User.findByIdAndUpdate(req.params.userId, req.body, {
        new: true,
        runValidators: true
    });
    res.status(200).json({
        success: true,
        data: user
    });
}));
//@desc  delete user
//@route DELETE /api/v1/auth/users/:userId
//@access Private/Admin
exports.deleteUser = asyncHandler((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield User.findByIdAndDelete(req.params.userId);
    res.status(200).json({
        success: true,
        data: {}
    });
}));
//# sourceMappingURL=users.js.map