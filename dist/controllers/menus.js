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
const Restuarent = require('../models/Restuarent');
const ObjectID = require('mongodb').ObjectID;
//@desc  Get Menu of a restuarent
//@route GET /api/v1/restuarents/:restuarentId/menus
//@route GET /api/v1/menus
//@access Public
exports.getMenu = asyncHandler((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.params.restuarentId) {
        const menu = yield Menu.find({
            restuarent: req.params.restuarentId
        }).populate({
            path: 'restuarent',
            select: 'name description'
        });
        res.status(200).json({ Success: true, data: menu });
    }
    else {
        res.status(200).json(res.advancedResults);
    }
}));
//@desc  Get Favourites/fast moving Menu of a restuarent
//@route GET /api/v1/restuarents/:restuarentId/menus/favourites
//@access Public
exports.getFavouriteMenu = asyncHandler((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.params.restuarentId) {
        const obj = yield Menu.aggregate([
            {
                $match: {
                    restuarent: {
                        $in: [ObjectID(req.params.restuarentId)],
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
        return next(new ErrorResponse(`No menu with id of ${req.params.restuarentId}`, 404));
    }
}));
//@desc Add menu
//@route POST /api/v1/restuarents/:restuarentId/menus
//@access Private
exports.addMenu = asyncHandler((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    //link to models/course/courseschema/bootcampId
    req.body.restuarent = req.params.restuarentId;
    // req.body.user = req.user.id;
    const restuarent = yield Restuarent.findById(req.params.restuarentId);
    if (!restuarent) {
        return next(new ErrorResponse(`No restuarent with the id of ${req.params.restuarentId}`, 404));
    }
    // // Make sure user is bootcamp owner
    // if (bootcamp.user.toString() !== req.user.id && req.user.role !== "admin") {
    //     return next(
    //         new ErrorResponse(
    //             `User ${req.user.id} is not authorized to add a course to bootcamp ${bootcamp._id}`,
    //             401
    //         )
    //     );
    // }
    const menu = yield Menu.updateOne({ restuarent: req.params.restuarentId }, { $push: { menu: req.body } });
    if (!menu) {
        return next(new ErrorResponse(`No menu with id of ${req.params.restuarentId}`, 404));
    }
    res.status(201).json({
        success: true,
        data: req.body
    });
}));
//@desc Update menu
//@route PUT /api/v1/restuarents/:restuarentId/menus/:menuId
//@access Private
exports.updateMenu = asyncHandler((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // //link to models/menu/menuschema/restuarentId
    const restuarent = yield Restuarent.findById(req.params.restuarentId);
    if (!restuarent) {
        return next(new ErrorResponse(`No restuarent with the id of ${req.params.restuarentId}`, 404));
    }
    const menu = yield Menu.updateOne({ restuarent: req.params.restuarentId }, { $pull: { menu: { _id: req.params.menuId } } }, { multi: true });
    if (!menu) {
        return next(new ErrorResponse(`No menu with id of ${req.params.menuId}`, 404));
    }
    req.body._id = req.params.menuId;
    yield Menu.updateOne({ restuarent: req.params.restuarentId }, { $push: { menu: req.body } });
    res.status(200).json({
        success: true,
        data: req.body
    });
}));
// @desc      Delete menu
// @route     DELETE /api/v1/restuarents/:restuarentId/menus/:menuId
// @access    Private
exports.deleteMenu = asyncHandler((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const menu = yield Menu.updateOne({ restuarent: req.params.restuarentId }, { $pull: { menu: { _id: req.params.menuId } } }, { multi: true });
    if (!menu) {
        return next(new ErrorResponse(`No course with the id of ${req.params.id}`, 404));
    }
    // // Make sure user is course owner
    // if (course.user.toString() !== req.user.id && req.user.role !== "admin") {
    //   return next(
    //     new ErrorResponse(
    //       `User ${req.user.id} is not authorized to update a course ${course._id}`,
    //       401
    //     )
    //   );
    // }
    res.status(200).json({
        success: true,
        data: {}
    });
}));
// @desc      Upload photo for restuarent
// @route     PUT /api/v1/restuarents/:restuarentId/:menuId/photo
// @access    Private
exports.menuPhotoUpload = asyncHandler((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const restuarent = yield Restuarent.findById(req.params.restuarentId);
    if (!restuarent) {
        return next(new ErrorResponse(`restuarent not found with id of ${req.params.restuarentId}`, 404));
    }
    // Make sure user is bootcamp owner
    // if (bootcamp.user.toString() !== req.user.id && req.user.role !== "admin") {
    //   return next(
    //     new ErrorResponse(
    //       `User ${req.user.id} is not authorized to delete this bootcamp`,
    //       401
    //     )
    //   );
    // }
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
    file.name = `menu_${restuarent.name}_${req.params.menuId}${path.parse(file.name).ext}`;
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