export{}
const path = require('path');
const ErrorResponse = require('../utils/errorResponse');
const Restuarant = require('../models/Restuarant');
const asyncHandler = require('../middleware/async');
const geocoder = require('../utils/geocoder');

//@desc  Get all Restuarants
//@route GET /api/v1/restuarants
//@access Public
exports.getRestuarants = asyncHandler(async (req, res, next) => {
    res.status(200).json(res.advancedResults);
});

//@desc  Get single restuarant
//@route GET /api/v1/restuarants/:id
//@access Public
exports.getRestuarant = asyncHandler(async (req, res, next) => {
  const restuarant = await Restuarant.findById(req.params.id);

  if (!restuarant) {
    return next(
      new ErrorResponse(`Restuarant not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({ Success: true, data: restuarant });

  //res.status(400).json({ success: false });
  // next(err);
});

//@desc  Create new Restuarant
//@route POST /api/v1/restuarants
//@access Private
exports.createRestuarant = asyncHandler(async (req, res, next) => {
   //Add user to req,body
  req.body.user = req.user.id;
  
  //Check for publised restuarant
  const publishedRestuarant = await Restuarant.findOne({ user: req.user.id });

  //if the owner is not an admin, they can only add one restuarant
  if (publishedRestuarant && req.user.role != 'admin') {
    return next(
      new ErrorResponse(
        `the user with ID ${req.user.id} has already published a restuarant`,
        400
      )
    );
  }

  const restuarant = await Restuarant.create(req.body);
  res.status(201).json({ Success: true, data: restuarant });
});

//@desc  Update restuarant
//@route PUT /api/v1/restuarants/:restuarantId
//@access Private
exports.updateRestuarant = asyncHandler(async (req, res, next) => {
  let restuarant = await Restuarant.findById(req.params.restuarantId);

  if (!restuarant) {
    return next(
      new ErrorResponse(
        `Restuarant not found with id of ${req.params.restuarantId}`,
        404
      )
    );
  }

  // Make sure user is restuarant owner
  if (restuarant.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to update this restuarant`,
        401
      )
    );
  }

  restuarant = await Restuarant.findByIdAndUpdate(
    req.params.restuarantId,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).json({ success: true, data: restuarant });
});

//@desc  Delete new Restuarant
//@route DELETE /api/v1/restuarants/:restuarantId
//@access Private
exports.deleteRestuarant = asyncHandler(async (req, res, next) => {
  const restuarant = await Restuarant.findById(req.params.restuarantId);

  if (!restuarant) {
    return next(
      new ErrorResponse(
        `Restuarant not found with id of ${req.params.restuarantId}`,
        404
      )
    );
  }

  // Make sure user is restuarant owner
  if (restuarant.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to update this restuarant`,
        401
      )
    );
  }

  restuarant.remove();
  res.status(200).json({ success: true, data: {} });
});


//@desc  Get restuarants within a radius
//@route GET /api/v1/restuarants/radius/:zipcode/:distance
//@access Private
exports.getRestuarantsInRadius = asyncHandler( async (req, res, next) => {
const {zipcode, distance} = req.params;

//Get lat and long from geocoder
const loc = await geocoder.geocode(zipcode);
const lat = loc[0].latitude;
const lng = loc[0].longitude;


  //calc radius using radians
  //Divide radius of earth and radians
  //Earth Radius = 3,963 mi / 6,378 km
  const radius = distance / 3963;

  const hotels = await Restuarant.find({
  location: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
});

  res.status(200).json({
    success: true,
    count: hotels.length,
    data: hotels
});
});

// @desc      Upload photo for restuarant
// @route     PUT /api/v1/restuarants/:restuarantId/photo
// @access    Private
exports.restuarantPhotoUpload = asyncHandler(async (req, res, next) => {
  const restuarant = await Restuarant.findById(req.params.restuarantId);

  if (!restuarant) {
    return next(
      new ErrorResponse(
        `Restuarant not found with id of ${req.params.restuarantId}`,
        404
      )
    );
  }

  // Make sure user is restuarant owner
  if (restuarant.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to update this restuarant`,
        401
      )
    );
  }


  if (!req.files){
    return next(new ErrorResponse(`Please upload a file`, 400));
  }
   const file = req.files.file;

  //Make sure the image is the photo
  if (!file.mimetype.startsWith('image')) {
     return next(new ErrorResponse(`Please upload a image file`, 400));
  }
  
  //Check filesize
  if (file.size > process.env.MAX_FILE_UPLOAD) {
    return next(
      new ErrorResponse(
        `Please upload a image less than ${process.env.MAX_FILE_UPLOAD}`,
        400
      )
    );
  }
  //Create custom filename
  file.name = `Restuarant_${restuarant.name}_${restuarant._id}${
    path.parse(file.name).ext
  }`;

  file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async err => {
    if (err) {
      console.error(err);
      return next(new ErrorResponse(`Problem with file upload`, 500));
    }
    await Restuarant.findByIdAndUpdate(req.params.restuarantId, {
      photo: file.name,
    });
  });
res.status(200).json({
  success: true,
  data: file.name,
});
});