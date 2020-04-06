"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const ObjectID = require('mongodb').ObjectID;
const Menu = require('../models/Menu');
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
    review: String,
    rating: Number,
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
//Update the menu ratings after every order
OrderSchema.statics.getAvgMenuRating = function (menuId) {
    return __awaiter(this, void 0, void 0, function* () {
        const obj = yield this.aggregate([
            {
                $match: {
                    menu: {
                        $in: [ObjectID(menuId)],
                    },
                },
            },
            {
                $group: {
                    _id: '$menu',
                    averageRatings: { $avg: '$rating' },
                },
            },
        ]);
        try {
            yield this.model('Menu').findOneAndUpdate({ 'menu._id': menuId }, { $set: { 'menu.$.avgrating': obj[0].averageRatings } });
        }
        catch (err) {
            console.error(err);
        }
        // Updating the ratings for the restuarent 
        let menu = yield Menu.find({ 'menu._id': menuId });
        Menu.getAverageRating(menu[0].restuarent);
    });
};
//Call getAverageCost after save
OrderSchema.post('save', function () {
    this.constructor.getAvgMenuRating(this.menu);
});
//Call getAverageCost before remove
OrderSchema.pre('remove', function () {
    this.constructor.getAvgMenuRating(this.menu);
});
module.exports = mongoose_1.default.model('Order', OrderSchema);
//# sourceMappingURL=Order.js.map