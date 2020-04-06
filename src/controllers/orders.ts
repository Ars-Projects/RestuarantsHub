export{}
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Order = require('../models/Order');
const Restuarent = require('../models/Restuarent');

//@desc  Create order
//@route POST /api/v1/restuarents/:restuarentId/orders
//@access Public
exports.createOrder = asyncHandler(async (req, res, next) => {
  req.body.restuarent = req.params.restuarentId;
  // req.body.user = req.user.id;
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
//@route PUT /api/v1/orders/:orderId
//@access Public/Private
exports.updateOrder = asyncHandler(async (req, res, next) => {
  let order = await Order.findById(req.params.orderId);

  if (!order) {
    return next(
      new ErrorResponse(`No order with id of ${req.params.orderId}`, 404)
    );
  }

  order = await Order.findByIdAndUpdate(req.params.orderId, req.body, {
    new: true,
    runValidators: true
  });

  res.status(201).json({
    success: true,
    data: order
  });
});

//@desc  Delete order
//@route DELETE /api/v1/orders/:orderId
//@access Private/Public(within time)
exports.deleteOrder = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.orderId);

  if (!order) {
    return next(
      new ErrorResponse(`No order with id of ${req.params.orderId}`, 404)
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
//@route POST /api/v1/orders/reviews/:orderId
//@access Public
exports.addReview = asyncHandler(async (req, res, next) => {
  // req.body.user = req.user.id;

  let order = await Order.findById(req.params.orderId);

  if (!order) {
    return next(
      new ErrorResponse(`No order with id of ${req.params.orderId}`, 404)
    );
  }

   order = await Order.findByIdAndUpdate(req.params.orderId, req.body, {
     new: true,
     runValidators: true
   });
  
   //Update the ratings after the review
   Order.getAvgMenuRating(order.menu);
  
  res.status(201).json({
    success: true,
    data: order
  });
});

//@desc  Update review
//@route PUT /api/v1/orders/reviews/:orderId
//@access Public
exports.updateReview = asyncHandler(async (req, res, next) => {
  let order = await Order.findById(req.params.orderId);

  if (!order) {
    return next(
      new ErrorResponse(`No review with id of ${req.params.orderId}`, 404)
    );
  }

//   //Make sure review belongs to user/admin
//   if (review.user.toString() !== req.user.id && req.user.role !== "admin") {
//     return next(new ErrorResponse(`Not authorised to update review`, 401));
//   }

  order = await Order.findByIdAndUpdate(req.params.orderId, req.body, {
    new: true,
    runValidators: true
  });

  //Update the ratings after the review
  Order.getAvgMenuRating(order.menu);

  res.status(201).json({
    success: true,
    data: order
  });
});

//@desc  Delete review
//@route DELETE /api/v1/orders/reviews/:orderId
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
  //Update the ratings after the review
  Order.getAvgMenuRating(order.menu);
 
 res.status(201).json({
   success: true,
   data: order
 });
});
