"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const FoodSchema = new mongoose_1.default.Schema({
    name: String,
    price: Number,
    cuisune: String,
    description: String,
    photo: {
        type: String,
        default: "no-photo.jpg"
    }
});
// const foodModel = mongoose.model('food',foodSchema);
const MenuSchema = new mongoose_1.default.Schema({
    // menu:{
    //         type: mongoose.Schema.ObjectId,
    //         ref: "food",
    //         required: true
    //       }
    menu: [FoodSchema],
    restuarent: {
                type: mongoose.Schema.ObjectId,
                ref: "Restuarent",
                required: true
                }
        // orders: {
        //     type: mongoose.Schema.ObjectId,
        //     ref: "Orders",
        //     required: true
        //   }
});
module.exports = mongoose_1.default.model('Menu', MenuSchema);
//# sourceMappingURL=Menu.js.map