import mongoose from 'mongoose';


const FoodSchema = new mongoose.Schema(
    {
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
      },
    orders: {
        type: mongoose.Schema.ObjectId,
        ref: "Orders",
        required: true
      }
});



module.exports = mongoose.model('Menu',MenuSchema);
