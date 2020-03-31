export{}
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Order = require('../models/Order');
const Restuarent = require('../models/Restuarent');

//@desc  Create order
//@route POST /api/v1/restuarents/:restuarentId/orders
//@access Public
exports.createOrder = asyncHandler(async (req, res, next) => {
  req.body.bootcamp = req.params.bootcampId;
  req.body.user = req.user.id;
  const restuarent = await Restuarent.findById(req.params.restuarentId);

  if (!restuarent) {
    return next(
      new ErrorResponse(`No restuarent with id of ${req.params.restuarentId}`, 404)
    );
  }

  const order = await Order.create(req.body);

  res.status(201).json({
    success: true,
    data: order
  });
});


//@desc  Update order
//@route PUT /api/v1/orders/:id
//@access Public
exports.updateOrder = asyncHandler(async (req, res, next) => {
  let order = await Order.findById(req.params.id);

  if (!order) {
    return next(
      new ErrorResponse(`No order with id of ${req.params.id}`, 404)
    );
  }

  order = await Order.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(201).json({
    success: true,
    data: order
  });
});

//@desc  Delete review
//@route DELETE /api/v1/orders/:id
//@access Private
exports.deleteReview = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(
      new ErrorResponse(`No order with id of ${req.params.id}`, 404)
    );
  }

//   //Make sure review belongs to user/admin
//   if (review.user.toString() !== req.user.id && req.user.role !== "admin") {
//     return next(new ErrorResponse(`Not authorised to update review`, 401));
//   }

  await order.remove();

  res.status(201).json({
    success: true,
    data: {}
  });
});

//@desc  Add review
//@route POST /api/v1/orders/:id
//@access Private
exports.addReview = asyncHandler(async (req, res, next) => {
  req.body.restuarent = req.params.restuarentId;
  req.body.user = req.user.id;
  const restuarent = await Restuarent.findById(req.params.restuarentId);

  if (!restuarent) {
    return next(
      new ErrorResponse(`No restuarent with id of ${req.params.restuarentId}`, 404)
    );
  }

   let order = await Order.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });


  res.status(201).json({
    success: true,
    data: order
  });
});

//@desc  Update review
//@route PUT /api/v1/orders/:id
//@access Private
exports.updateReview = asyncHandler(async (req, res, next) => {
  let order = await Order.findById(req.params.id);

  if (!order) {
    return next(
      new ErrorResponse(`No review with id of ${req.params.id}`, 404)
    );
  }

//   //Make sure review belongs to user/admin
//   if (review.user.toString() !== req.user.id && req.user.role !== "admin") {
//     return next(new ErrorResponse(`Not authorised to update review`, 401));
//   }

  order = await order.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(201).json({
    success: true,
    data: order
  });
});

//@desc  Delete review
//@route DELETE /api/v1/reviews/:orderId
//@access Private
exports.deleteReview = asyncHandler(async (req, res, next) => {
  let order = await Order.findById(req.params.orderId);

  if (!order) {
    return next(
      new ErrorResponse(`No order with id of ${req.params.orderId}`, 404)
    );
  }

//   //Make sure review belongs to user/admin
//   if (review.user.toString() !== req.user.id && req.user.role !== "admin") {
//     return next(new ErrorResponse(`Not authorised to update review`, 401));
//   }

  order = await Order.findByIdAndUpdate(
    req.params.orderId,
    { 
    review: '', 
    rating: '' 
    },
    {
      new: true,
      runValidators: true
    }
  );
 
 res.status(201).json({
   success: true,
   data: order
 });
});
