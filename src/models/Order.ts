import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema({
    order:{type: String,
        required: [true, 'Please add order']},
    orderTime:{type: Date,
        default: Date.now
    },
    price:{type: Number,
        required: [true, 'Price of the order']},
	discount: Number,
	finalPrice:{type: Number,
        required: [true, 'final price is']},
    estimatedDeliveryTime: Number,
    actualDeliveryTime: Number,
    deliveryAddress:{type: String,
        required: [true, 'Please add address']},
	review: {type: String,
        required: [true, 'Please add review']},
	rating: {type: Number,
        required: [true, 'Please add rating']},
    restuarent: {
            type: mongoose.Schema.ObjectId,
            ref: "Restuarent",
            required: true
    },
    menu: {
            type: mongoose.Schema.ObjectId,
            ref: "Menu",
            required: true
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true
    }
});

module.exports = mongoose.model('Order',OrderSchema);
