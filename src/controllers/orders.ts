export{}
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Order = require('../models/Order');
const Restuarant = require('../models/Restuarant');
const Menu = require('../models/Menu');
const ObjectID = require('mongodb').ObjectID;

//@desc  Create order
//@route POST /api/v1/restuarants/:restuarantId/orders/:menuId
//@access Public
exports.createOrder = asyncHandler(async (req, res, next) => {
  
 const menuOrdered = await Menu.findOne(
   {
     'menu._id':req.params.menuId
     },
   { 'menu.$.avgrating': 1 }
 );
  
 req.body = {
    restuarant: req.params.restuarantId,
    menu: req.params.menuId,
    user: req.user.id,
    order: menuOrdered.menu[0].name,
    price: menuOrdered.menu[0].price,
    discount: req.user.offer,
    deliveryAddress: req.user.address
 }
  
 const price = req.body.price;
 const discount = req.body.discount;
 req.body.finalPrice = price - (price * (discount/100));

  const restuarant = await Restuarant.findById(req.params.restuarantId);

  if (!restuarant) {
    return next(
      new ErrorResponse(`No restuarant with id of ${req.params.restuarantId}`, 404)
    );
  }
  
  const orders = await Order.create(req.body);

  res.status(201).json({
    success: true,
    data: orders
  });
});


//@desc  Update order
//@route PUT /api/v1/orders/:orderId
//@access Public/Private
exports.updateOrder = asyncHandler(async (req, res, next) => {

  req.body.user = req.user.id;

  let order = await Order.findById(req.params.orderId);

  if (!order) {
    return next(
      new ErrorResponse(`No order with id of ${req.params.orderId}`, 404)
    );
  }

  //Make sure order belongs to customer
  if (order.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(new ErrorResponse(`Not authorised to update order`, 401));
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

  req.body.user = req.user.id;

  const order = await Order.findById(req.params.orderId);

  if (!order) {
    return next(
      new ErrorResponse(`No order with id of ${req.params.orderId}`, 404)
    );
  }

//Make sure order belongs to customer
  if (order.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(new ErrorResponse(`Not authorised to delete order`, 401));
  }

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

  req.body.user = req.user.id;

  let order = await Order.findById(req.params.orderId);

  if (!order) {
    return next(
      new ErrorResponse(`No order with id of ${req.params.orderId}`, 404)
    );
  }


//Make sure review belongs to customer
  if (order.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(new ErrorResponse(`Not authorised to add review`, 401));
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

  req.body.user = req.user.id;

  let order = await Order.findById(req.params.orderId);

  if (!order) {
    return next(
      new ErrorResponse(`No review with id of ${req.params.orderId}`, 404)
    );
  }

  //Make sure review belongs to customer
  if (order.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(new ErrorResponse(`Not authorised to update review`, 401));
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

//@desc  Delete review
//@route DELETE /api/v1/orders/reviews/:orderId
//@access Private
exports.deleteReview = asyncHandler(async (req, res, next) => {

  req.body.user = req.user.id;
  
  let order = await Order.findById(req.params.orderId);

  if (!order) {
    return next(
      new ErrorResponse(`No order with id of ${req.params.orderId}`, 404)
    );
  }

//Make sure review belongs to customer
  if (order.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(new ErrorResponse(`Not authorised to delete review`, 401));
  }

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
