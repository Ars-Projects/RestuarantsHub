import mongoose from 'mongoose';


const FoodSchema = new mongoose.Schema(
    {
    name: String,
    price: Number,
    description:String,
    isAvailable:Boolean,
    photo: {
        type: String,
        default: "no-photo.jpg"
      }
});
// const foodModel = mongoose.model('food',foodSchema);

const MenuSchema = new mongoose.Schema({
    menu:[FoodSchema],

    restuarent: {
        type: mongoose.Schema.ObjectId,
        ref: "Restuarent",
        required: true
      },
    popular:[String]

    // orders: {
    //     type: mongoose.Schema.ObjectId,
    //     ref: "Orders",
    //     required: true
    //   }
});

module.exports = mongoose.model('Menu',MenuSchema);
