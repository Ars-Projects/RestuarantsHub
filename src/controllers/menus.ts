export {}
const Menu = require('../models/Menu');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Restuarent = require('../models/Restuarent');


//@desc  Get Menu of a restuarent
//@route GET /api/v1/restuarents/:restuarentId/menus
//@route GET /api/v1/menus
//@access Public
exports.getMenu = asyncHandler(async (req, res, next) => {
  if (req.params.restuarentId) {
    const menu = await Menu.find({ restuarent: req.params.restuarentId });
    res.status(200).json({ Success: true, data: menu });
  } else {
    //get all menu based on limit, ratings, etc
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

  const menu = await Menu.update({restuarent: req.params.restuarentId }, 
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

const menu = await Menu.update(
  { restuarent: req.params.restuarentId },
  { $pull: { menu: { _id: req.params.menuId } } },
  { multi: true }
);

if (!menu) {
  return next(
    new ErrorResponse(`No menu with id of ${req.params.menuId}`, 404)
  );
}

await Menu.update(
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
  const menu = await Menu.update(
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
