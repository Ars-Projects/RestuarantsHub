"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const FoodSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name'],
        unique: true,
        trim: true,
        maxLength: [50, "Name cannot be more than 50 characters"]
    },
    price: {
        type: Number,
        required: [true, 'Please add a name']
    },
    description: String,
    isAvailable: Boolean,
    photo: {
        type: String,
        default: "no-photo.jpg"
    },
    avgrating: Number
});
const MenuSchema = new mongoose_1.default.Schema({
    menu: [FoodSchema],
    favourites: {
        type: Array
    },
    restuarent: {
        type: mongoose_1.default.Schema.ObjectId,
        ref: "Restuarent",
        required: true
    },
});
module.exports = mongoose_1.default.model('MenuO', MenuSchema);
//# sourceMappingURL=MenuO.js.map