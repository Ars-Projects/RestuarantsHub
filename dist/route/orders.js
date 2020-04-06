"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const { createOrder, updateOrder, deleteOrder, addReview, updateReview, deleteReview } = require('../controllers/orders');
const router = express_1.default.Router({ mergeParams: true });
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
//# sourceMappingURL=orders.js.map