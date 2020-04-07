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
const path = require('path');
const ErrorResponse = require('../utils/errorResponse');
const Restuarent = require('../models/Restuarent');
const asyncHandler = require('../middleware/async');
const geocoder = require('../utils/geocoder');
//@desc  Get all Restuarents
//@route GET /api/v1/restuarents
//@access Public
exports.getRestuarents = asyncHandler((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    res.status(200).json(res.advancedResults);
}));
//@desc  Get single restuarent
//@route GET /api/v1/restuarents/:id
//@access Public
exports.getRestuarent = asyncHandler((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const restuarent = yield Restuarent.findById(req.params.id);
    if (!restuarent) {
        return next(new ErrorResponse(`Restuarent not found with id of ${req.params.id}`, 404));
    }
    res.status(200).json({ Success: true, data: restuarent });
    //res.status(400).json({ success: false });
    // next(err);
}));
//@desc  Create new Restuarent
//@route POST /api/v1/restuarents
//@access Private
exports.createRestuarent = asyncHandler((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const restuarent = yield Restuarent.create(req.body);
    res.status(201).json({ Success: true, data: restuarent });
}));
//@desc  Update restuarent
//@route PUT /api/v1/restuarents/:restuarentId
//@access Private
exports.updateRestuarent = asyncHandler((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let restuarent = yield Restuarent.findById(req.params.restuarentId);
    if (!restuarent) {
        return next(new ErrorResponse(`Restuarent not found with id of ${req.params.restuarentId}`, 404));
    }
    restuarent = yield Restuarent.findByIdAndUpdate(req.params.restuarentId, req.body, {
        new: true,
        runValidators: true,
    });
    res.status(200).json({ success: true, data: restuarent });
}));
//@desc  Delete new Restuarent
//@route DELETE /api/v1/restuarents/:restuarentId
//@access Private
exports.deleteRestuarent = asyncHandler((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const restuarent = yield Restuarent.findById(req.params.restuarentId);
    if (!restuarent) {
        return next(new ErrorResponse(`Restuarent not found with id of ${req.params.restuarentId}`, 404));
    }
    restuarent.remove();
    res.status(200).json({ success: true, data: {} });
}));
//@desc  Get restuarents within a radius
//@route GET /api/v1/restuarents/radius/:zipcode/:distance
//@access Private
exports.getRestuarentsInRadius = asyncHandler((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { zipcode, distance } = req.params;
    //Get lat and long from geocoder
    const loc = yield geocoder.geocode(zipcode);
    const lat = loc[0].latitude;
    const lng = loc[0].longitude;
    //calc radius using radians
    //Divide radius of earth and radians
    //Earth Radius = 3,963 mi / 6,378 km
    const radius = distance / 3963;
    const hotels = yield Restuarent.find({
        location: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
    });
    res.status(200).json({
        success: true,
        count: hotels.length,
        data: hotels
    });
}));
// @desc      Upload photo for restuarent
// @route     PUT /api/v1/restuarents/:restuarentId/photo
// @access    Private
exports.restuarentPhotoUpload = asyncHandler((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const restuarent = yield Restuarent.findById(req.params.restuarentId);
    if (!restuarent) {
        return next(new ErrorResponse(`Restuarent not found with id of ${req.params.restuarentId}`, 404));
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
    file.name = `Restuarent_${restuarent.name}_${restuarent._id}${path.parse(file.name).ext}`;
    file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, (err) => __awaiter(void 0, void 0, void 0, function* () {
        if (err) {
            console.error(err);
            return next(new ErrorResponse(`Problem with file upload`, 500));
        }
        yield Restuarent.findByIdAndUpdate(req.params.restuarentId, {
            photo: file.name,
        });
    }));
    res.status(200).json({
        success: true,
        data: file.name,
    });
}));
//# sourceMappingURL=restuarents.js.map