const ErrorResponses = require('../utils/errorResponse');
const Restuarent = require('../models/Restuarent');
const asyncHandler = require('../middleware/async');

//@desc  Get all Restuarents
//@route GET /api/v1/restuarents
//@access Public
exports.getRestuarents = asyncHandler(async (req, res, next) => {
  const restuarent = await Restuarent.find();

  if (!restuarent) {
    return next(new ErrorResponse(`Restuarent not found`, 404));
  }

  res.status(200).json({ Success: true, data: restuarent });
});

//@desc  Get single restuarent
//@route GET /api/v1/restuarents/:id
//@access Public
exports.getRestuarent = asyncHandler(async (req, res, next) => {
  const restuarent = await Restuarent.findById(req.params.id);

  if (!restuarent) {
    return next(
      new ErrorResponse(`Restuarent not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({ Success: true, data: restuarent });

  //res.status(400).json({ success: false });
  // next(err);
});

//@desc  Create new Restuarent
//@route POST /api/v1/restuarents
//@access Private
exports.createRestuarent = asyncHandler(async (req, res, next) => {
  const restuarent = await Restuarent.create(req.body);
  res.status(201).json({ Success: true, data: restuarent });
});

//@desc  Update restuarent
//@route PUT /api/v1/restuarents/:id
//@access Private
exports.updateRestuarent = asyncHandler(async (req, res, next) => {
  let restuarent = await Restuarent.findById(req.params.id);

  if (!restuarent) {
    return next(
      new ErrorResponse(`Restuarent not found with id of ${req.params.id}`, 404)
    );
  }

  restuarent = await Restuarent.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({ success: true, data: restuarent });
});

//@desc  Delete new Restuarent
//@route DELETE /api/v1/restuarents/:id
//@access Private
exports.deleteRestuarent = asyncHandler(async (req, res, next) => {
  const restuarent = await Restuarent.findById(req.params.id);

  if (!restuarent) {
    return next(
      new ErrorResponse(`Restuarent not found with id of ${req.params.id}`, 404)
    );
  }
  restuarent.remove();
  res.status(200).json({ success: true, data: {} });
});
