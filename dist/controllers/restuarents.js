var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const ErrorResponses = require('../utils/errorResponse');
const Restuarent = require('../models/Restuarent');
const asyncHandler = require('../middleware/async');
//@desc  Get all Restuarents
//@route GET /api/v1/restuarents
//@access Public
exports.getRestuarents = asyncHandler((req, res, next) => __awaiter(this, void 0, void 0, function* () {
    const restuarent = yield Restuarent.find();
    if (!restuarent) {
        return next(new ErrorResponse(`Restuarent not found`, 404));
    }
    res.status(200).json({ Success: true, data: restuarent });
}));
//@desc  Get single restuarent
//@route GET /api/v1/restuarents/:id
//@access Public
exports.getRestuarent = asyncHandler((req, res, next) => __awaiter(this, void 0, void 0, function* () {
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
exports.createRestuarent = asyncHandler((req, res, next) => __awaiter(this, void 0, void 0, function* () {
    const restuarent = yield Restuarent.create(req.body);
    res.status(201).json({ Success: true, data: restuarent });
}));
//@desc  Update Bootcamp
//@route PUT /api/v1/restuarents/:id
//@access Private
exports.updateRestuarent = asyncHandler((req, res, next) => __awaiter(this, void 0, void 0, function* () {
    let restuarent = yield Restuarent.findById(req.params.id);
    if (!restuarent) {
        return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404));
    }
    restuarent = yield Restuarent.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });
    res.status(200).json({ success: true, data: restuarent });
}));
//@desc  Delete new Restuarent
//@route DELETE /api/v1/restuarents/:id
//@access Private
exports.deleteRestuarent = asyncHandler((req, res, next) => __awaiter(this, void 0, void 0, function* () {
    const restuarent = yield Restuarent.findById(req.params.id);
    if (!restuarent) {
        return next(new ErrorResponse(`Restuarent not found with id of ${req.params.id}`, 404));
    }
    restuarent.remove();
    res.status(200).json({ success: true, data: {} });
}));
//# sourceMappingURL=restuarents.js.map