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
let Menu = require('../models/Menu');
const path = require('path');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Restuarant = require('../models/Restuarant');
const ObjectID = require('mongodb').ObjectID;
//@desc  Get Menu of a restuarant
//@route GET /api/v1/restuarants/:restuarantId/menus
//@route GET /api/v1/menus
//@access Public
exports.getMenu = asyncHandler((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.params.restuarantId) {
        const menu = yield Menu.find({
            restuarant: req.params.restuarantId
        }).populate({
            path: 'restuarant',
            select: 'name description'
        });
        res.status(200).json({ Success: true, data: menu });
    }
    else {
        res.status(200).json(res.advancedResults);
    }
}));
//@desc  Get Favourites/fast moving Menu of a restuarant
//@route GET /api/v1/restuarants/:restuarantId/menus/favourites
//@access Public
exports.getFavouriteMenu = asyncHandler((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.params.restuarantId) {
        const obj = yield Menu.aggregate([
            {
                $match: {
                    restuarant: {
                        $in: [ObjectID(req.params.restuarantId)],
                    },
                },
            },
            { $unwind: '$menu' },
            {
                $sort: { 'menu.avgrating': -1 },
            },
            {
                $group: { _id: '$_id', menu: { $push: '$menu' } },
            },
        ]);
        res.status(200).json({ Success: true, data: obj[0].menu });
    }
    else {
        return next(new ErrorResponse(`No menu with id of ${req.params.restuarantId}`, 404));
    }
}));
//@desc  Create new Restuarant
//@route POST /api/v1/restuarants/:restuarantId/menus
//@access Private
exports.createMenu = asyncHandler((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    //Add user to req,body
    req.body.user = req.user.id;
    req.body.restuarant = req.params.restuarantId;
    //Check for publised restuarant
    const publishedMenu = yield Menu.findOne({ user: req.user.id });
    //if the owner is not an admin, they can only add one restuarant
    if (publishedMenu && req.user.role != 'admin') {
        return next(new ErrorResponse(`the user with ID ${req.user.id} has already published a menu`, 400));
    }
    const menu = yield Menu.create(req.body);
    res.status(201).json({ Success: true, data: menu });
}));
//@desc Add menu
//@route POST /api/v1/restuarants/:restuarantId/menus/addmenu
//@access Private
exports.addMenu = asyncHandler((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    //link to models/course/courseschema/bootcampId
    req.body.restuarant = req.params.restuarantId;
    req.body.user = req.user.id;
    const restuarant = yield Restuarant.findById(req.params.restuarantId);
    if (!restuarant) {
        return next(new ErrorResponse(`No restuarant with the id of ${req.params.restuarantId}`, 404));
    }
    // Make sure user is restuarant owner
    if (restuarant.user.toString() !== req.user.id && req.user.role !== "admin") {
        return next(new ErrorResponse(`User ${req.user.id} is not authorized to update this restuarant`, 401));
    }
    const menu = yield Menu.updateOne({ restuarant: req.params.restuarantId }, { $push: { menu: req.body } });
    if (!menu) {
        return next(new ErrorResponse(`No menu with id of ${req.params.restuarantId}`, 404));
    }
    res.status(201).json({
        success: true,
        data: req.body
    });
}));
//@desc Update menu
//@route PUT /api/v1/restuarants/:restuarantId/menus/:menuId
//@access Private
exports.updateMenu = asyncHandler((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // //link to models/menu/menuschema/restuarantId
    const restuarant = yield Restuarant.findById(req.params.restuarantId);
    if (!restuarant) {
        return next(new ErrorResponse(`No restuarant with the id of ${req.params.restuarantId}`, 404));
    }
    // Make sure user is restuarant owner
    if (restuarant.user.toString() !== req.user.id && req.user.role !== "admin") {
        return next(new ErrorResponse(`User ${req.user.id} is not authorized to update this restuarant`, 401));
    }
    const menu = yield Menu.updateOne({ restuarant: req.params.restuarantId }, { $pull: { menu: { _id: req.params.menuId } } });
    if (!menu) {
        return next(new ErrorResponse(`No menu with id of ${req.params.menuId}`, 404));
    }
    const menu_Id = req.params.menuId;
    req.body._id = menu_Id;
    yield Menu.updateOne({ restuarant: req.params.restuarantId }, { $push: { menu: req.body } });
    res.status(200).json({
        success: true,
        data: req.body
    });
}));
// @desc      Delete menu
// @route     DELETE /api/v1/restuarants/:restuarantId/menus/:menuId
// @access    Private
exports.deleteMenu = asyncHandler((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const menu = yield Menu.updateOne({ restuarant: req.params.restuarantId }, { $pull: { menu: { _id: req.params.menuId } } });
    if (!menu) {
        return next(new ErrorResponse(`No course with the id of ${req.params.id}`, 404));
    }
    // Make sure user is restuarant owner
    if (menu.user.toString() !== req.user.id && req.user.role !== "admin") {
        return next(new ErrorResponse(`User ${req.user.id} is not authorized to update this restuarant`, 401));
    }
    res.status(200).json({
        success: true,
        data: {}
    });
}));
// @desc      Upload photo for restuarant
// @route     PUT /api/v1/restuarants/:restuarantId/:menuId/photo
// @access    Private
exports.menuPhotoUpload = asyncHandler((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const restuarant = yield Restuarant.findById(req.params.restuarantId);
    if (!restuarant) {
        return next(new ErrorResponse(`restuarant not found with id of ${req.params.restuarantId}`, 404));
    }
    // Make sure user is restuarant owner
    if (restuarant.user.toString() !== req.user.id && req.user.role !== "admin") {
        return next(new ErrorResponse(`User ${req.user.id} is not authorized to delete this restuarant`, 401));
    }
    if (!req.files) {
        return next(new ErrorResponse(`Please upload a file`, 400));
    }
    const file = req.files.file;
    //Make sure the image is the photo
    if (!file.mimetype.startsWith('image')) {
        return next(new ErrorResponse(`Please upload a image file`, 400));
    }
    //Check filesize
    if (file.size > process.env.MAX_FILE_UPLOAD) {
        return next(new ErrorResponse(`Please upload a image less than ${process.env.MAX_FILE_UPLOAD}`, 400));
    }
    //Create custom filename
    file.name = `menu_${restuarant.name}_${req.params.menuId}${path.parse(file.name).ext}`;
    file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, (err) => __awaiter(void 0, void 0, void 0, function* () {
        if (err) {
            console.error(err);
            return next(new ErrorResponse(`Problem with file upload`, 500));
        }
        yield Menu.findOneAndUpdate({ 'menu._id': req.params.menuId }, { $set: { 'menu.$.photo': file.name } });
    }));
    res.status(200).json({
        success: true,
        data: file.name,
    });
}));
//# sourceMappingURL=menus.js.map