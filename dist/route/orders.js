"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const { createOrder, updateOrder, deleteOrder, addReview, updateReview, deleteReview } = require('../controllers/orders');
const router = express_1.default.Router({ mergeParams: true });
const { protect, authorize } = require('../middleware/auth');
router.route('/:menuId').post(protect, authorize('customer', 'owner', 'admin'), createOrder);
router
    .route('/:orderId')
    .put(updateOrder)
    .delete(protect, authorize('customer', 'owner', 'admin'), deleteOrder);
router
    .route('/reviews/:orderId')
    .post(protect, authorize('customer', 'owner', 'admin'), addReview)
    .put(protect, authorize('customer', 'owner', 'admin'), updateReview)
    .delete(protect, authorize('customer', 'owner', 'admin'), deleteReview);
module.exports = router;
//# sourceMappingURL=orders.js.map