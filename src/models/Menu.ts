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
    restuarant: {
        type: mongoose.Schema.ObjectId,
        ref: "Restuarant",
        required: true
      },
    user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true
  }
});

//static method to get average rating of menu

MenuSchema.statics.getAverageRating = async function (restuarantId) {
  const obj = await this.aggregate([
    {
      $match: { 
        restuarant: {
          $in: [ObjectID(restuarantId)] 
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
    await this.model('Restuarant').findByIdAndUpdate(restuarantId, {
      averageRating: obj[0].averageRatings,
    });
  } catch (err) {
    console.error(err);
  }
};

//Call getAverageCost after save
MenuSchema.post("save", function() {
  this.constructor.getAverageRating(this.restuarant);
});

//Call getAverageCost before remove
MenuSchema.pre("remove", function() {
  this.constructor.getAverageRating(this.restuarant);
});


module.exports = mongoose.model('Menu',MenuSchema,'Menu');
