"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const OrderSchema = new mongoose_1.default.Schema({
    order: { type: String,
        required: [true, 'Please add order'] },
    orderTime: { type: Date,
        default: Date.now
    },
    price: { type: Number,
        required: [true, 'Price of the order'] },
    discount: Number,
    finalPrice: { type: Number,
        required: [true, 'final price is'] },
    estimatedDeliveryTime: Number,
    actualDeliveryTime: Number,
    deliveryAddress: { type: String,
        required: [true, 'Please add address'] },
    review: { type: String,
        required: [true, 'Please add review'] },
    rating: { type: Number,
        required: [true, 'Please add rating'] },
    restuarent: {
        type: mongoose_1.default.Schema.ObjectId,
        ref: "Restuarent",
        required: true
    },
    menu: {
        type: mongoose_1.default.Schema.ObjectId,
        ref: "Menu",
        required: true
    },
    user: {
        type: mongoose_1.default.Schema.ObjectId,
        ref: "User",
        required: true
    }
});
module.exports = mongoose_1.default.model('Order', OrderSchema);
//# sourceMappingURL=Order.js.map