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
const FoodSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name'],
        unique: false,
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
    }
    // orders: {
    //     type: mongoose.Schema.ObjectId,
    //     ref: "Order",
    //     required: true
    //   }
});
//static method to get average rating of menu
MenuSchema.statics.getAverageRating = function (restuarentId) {
    return __awaiter(this, void 0, void 0, function* () {
        const obj = yield this.aggregate([
            {
                $match: {
                    restuarent: {
                        $in: [ObjectID(restuarentId)]
                    },
                },
            },
            { $unwind: '$menu' },
            {
                $group: {
                    _id: '$menu.isAvailable',
                    averageRatings: { $avg: '$menu.avgrating' },
                },
            },
        ]);
        try {
            yield this.model('Restuarent').findByIdAndUpdate(restuarentId, {
                averageRating: obj[0].averageRatings,
            });
        }
        catch (err) {
            console.error(err);
        }
    });
};
//Call getAverageCost after save
MenuSchema.post("save", function () {
    this.constructor.getAverageRating(this.restuarent);
});
//Call getAverageCost before remove
MenuSchema.pre("remove", function () {
    this.constructor.getAverageRating(this.restuarent);
});
module.exports = mongoose_1.default.model('Menu', MenuSchema, 'Menu');
//# sourceMappingURL=Menu.js.map