import express from 'express';

const {
  createOrder,
  updateOrder,
  deleteOrder,
  addReview,
  updateReview,
  deleteReview
} = require('../controllers/orders');

const router = express.Router({ mergeParams: true });

router
  .route('/')
  .post(createOrder);

router
  .route('/:orderId')
  .put(updateOrder)
  .delete(deleteOrder);
  
router
  .route('/reviews/:orderId')  
  .post(addReview)
  .put(updateReview)
  .delete(deleteReview);

module.exports = router;
