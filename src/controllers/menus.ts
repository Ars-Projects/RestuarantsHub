export {}
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
exports.getMenu = asyncHandler(async (req, res, next) => {
  if (req.params.restuarentId) {
    const menu = await Menu.find({
      restuarent: req.params.restuarentId
    }).populate({
      path: 'restuarent',
      select: 'name description'
    });
    res.status(200).json({ Success: true, data: menu });
  } else {
     res.status(200).json(res.advancedResults);
  }
});

//@desc  Get Favourites/fast moving Menu of a restuarent
//@route GET /api/v1/restuarents/:restuarentId/menus/favourites
//@access Public
exports.getFavouriteMenu = asyncHandler(async (req, res, next) => {
  if (req.params.restuarentId) {
    const obj = await Menu.aggregate([
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
  } else {
    return next(
      new ErrorResponse(`No menu with id of ${req.params.restuarentId}`, 404)
    );
  }
});

//@desc Add menu
//@route POST /api/v1/restuarents/:restuarentId/menus
//@access Private
exports.addMenu = asyncHandler(async (req, res, next) => {
  //link to models/course/courseschema/bootcampId
  req.body.restuarent = req.params.restuarentId;
  // req.body.user = req.user.id;

  const restuarent = await Restuarent.findById(req.params.restuarentId);

  if (!restuarent) {
    return next(
      new ErrorResponse(
        `No restuarent with the id of ${req.params.restuarentId}`,
        404
      )
    );
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

  const menu = await Menu.updateOne({restuarent: req.params.restuarentId }, 
    {$push: {menu: req.body}});

  if (!menu) {
    return next(
      new ErrorResponse(`No menu with id of ${req.params.restuarentId}`, 404)
    );
  }

  res.status(201).json({
    success: true,
    data: req.body
  });
});

//@desc Update menu
//@route PUT /api/v1/restuarents/:restuarentId/menus/:menuId
//@access Private
exports.updateMenu = asyncHandler( async(req, res, next) => {
  // //link to models/menu/menuschema/restuarentId

const restuarent = await Restuarent.findById(req.params.restuarentId);

if (!restuarent) {
  return next(
    new ErrorResponse(
      `No restuarent with the id of ${req.params.restuarentId}`,
      404
    )
  );
}

const menu = await Menu.updateOne(
  { restuarent: req.params.restuarentId },
  { $pull: { menu: { _id: req.params.menuId } } },
  { multi: true }
);

if (!menu) {
  return next(
    new ErrorResponse(`No menu with id of ${req.params.menuId}`, 404)
  );
}

req.body._id = req.params.menuId;

await Menu.updateOne(
  { restuarent: req.params.restuarentId },
  { $push: { menu: req.body } }
);
res.status(200).json({
  success: true,
  data: req.body
});
});

// @desc      Delete menu
// @route     DELETE /api/v1/restuarents/:restuarentId/menus/:menuId
// @access    Private
exports.deleteMenu = asyncHandler(async (req, res, next) => {
  const menu = await Menu.updateOne(
  { restuarent: req.params.restuarentId },
  { $pull: { menu: { _id: req.params.menuId } } },
  { multi: true });

  if (!menu) {
    return next(
      new ErrorResponse(`No course with the id of ${req.params.id}`, 404)
    );
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
});


// @desc      Upload photo for restuarent
// @route     PUT /api/v1/restuarents/:restuarentId/:menuId/photo
// @access    Private
exports.menuPhotoUpload = asyncHandler(async (req, res, next) => {
  const restuarent = await Restuarent.findById(req.params.restuarentId);

  if (!restuarent) {
    return next(
      new ErrorResponse(
        `restuarent not found with id of ${req.params.restuarentId}`,
        404
      )
    );
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
  file.name = `menu_${restuarent.name}_${req.params.menuId}${
    path.parse(file.name).ext
  }`;

  file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async err => {
    if (err) {
      console.error(err);
      return next(new ErrorResponse(`Problem with file upload`, 500));
    }
    await Menu.findOneAndUpdate(
      { 'menu._id': req.params.menuId },
      { $set: { 'menu.$.photo': file.name } }
    );
  });
res.status(200).json({
  success: true,
  data: file.name,
});
});