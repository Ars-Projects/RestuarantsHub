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

const { protect, authorize } = require('../middleware/auth');

router.route('/:menuId').post(protect, authorize('customer', 'owner','admin'), createOrder);

router
  .route('/:orderId')
  .put(updateOrder)
  .delete(protect, authorize('customer', 'owner' ,'admin'), deleteOrder);
  
router
  .route('/reviews/:orderId')
  .post(protect, authorize('customer', 'owner', 'admin'), addReview)
  .put(protect, authorize('customer', 'owner', 'admin'), updateReview)
  .delete(protect, authorize('customer', 'owner', 'admin'), deleteReview);

module.exports = router;
