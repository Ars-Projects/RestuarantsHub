import mongoose from 'mongoose';
const ObjectID = require('mongodb').ObjectID;

const FoodSchema = new mongoose.Schema(
    {
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
    description:String,
    isAvailable:Boolean,
    photo: {
        type: String,
        default: "no-photo.jpg"
      },
    avgrating:Number    
});


const MenuSchema = new mongoose.Schema({
    menu:[FoodSchema],
    favourites:{
      type:Array
    },
    restuarent: {
        type: mongoose.Schema.ObjectId,
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

MenuSchema.statics.getAverageRating = async function (restuarentId) {
  const obj = await this.aggregate([
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
    await this.model('Restuarent').findByIdAndUpdate(restuarentId, {
      averageRating: obj[0].averageRatings,
    });
  } catch (err) {
    console.error(err);
  }
};

//Call getAverageCost after save
MenuSchema.post("save", function() {
  this.constructor.getAverageRating(this.restuarent);
});

//Call getAverageCost before remove
MenuSchema.pre("remove", function() {
  this.constructor.getAverageRating(this.restuarent);
});


module.exports = mongoose.model('Menu',MenuSchema,'Menu');
