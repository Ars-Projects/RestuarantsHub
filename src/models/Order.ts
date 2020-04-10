import mongoose from 'mongoose';
const ObjectID = require('mongodb').ObjectID;
const Menu = require('../models/Menu');

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
	review: String,
	rating: Number,
    restuarant: {
            type: mongoose.Schema.ObjectId,
            ref: "Restuarant",
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

//Update the menu ratings after every order
OrderSchema.statics.getAvgMenuRating = async function (menuId) {
  const obj = await this.aggregate([
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
    await this.model('Menu').findOneAndUpdate(
      { 'menu._id': menuId },
      { $set: { 'menu.$.avgrating': obj[0].averageRatings } }
    );
  } catch (err) {
    console.error(err);
  }
  // Updating the ratings for the restuarant 
  let menu = await Menu.find({ 'menu._id': menuId });
  Menu.getAverageRating(menu[0].restuarant);
};

//Call getAverageCost after save
OrderSchema.post('save', function () {
  this.constructor.getAvgMenuRating(this.menu);
});

//Call getAverageCost before remove
OrderSchema.pre('remove', function () {
  this.constructor.getAvgMenuRating(this.menu);
});


module.exports = mongoose.model('Order',OrderSchema);
