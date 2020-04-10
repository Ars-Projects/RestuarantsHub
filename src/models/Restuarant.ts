import mongoose from 'mongoose';
import slugify from 'slugify';
const geocoder = require('../utils/geocoder');

const RestuarantSchema = new mongoose.Schema(
    {
    name:{
        type: String,
        required: [true, 'Please add a name'],
        unique: true,
        trim: true,
        maxLength: [50, "Name cannot be more than 50 characters"]
    },
    slug: String,
    description: {
        type: String,
        required: [true, 'Please add a description'],
        maxLength: [50, "description cannot be more than 50 characters"]
    },
    website: {
        type: String,
        match: [
          /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
          "Please use a valid url with HTTP or HTTPS"
        ]
      },
      phone: {
        type: String,
        maxlength: [20, "Phone mumber cannot be longer than 20 characters"]
      },
      email: {
        type: String,
        match: [
          /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
          "Please add a valid email"
        ]
      },
      address: {
        type: String,
        required: [true, "Please add an address"]
      },
      location: {
        // GeoJSON Point
        type: {
          type: String,
          enum: ["Point"]
        },
        coordinates: {
          type: [Number],
          index: "2dsphere"
        },
        formattedAddress: String,
        Street: String,
        city: String,
        state: String,
        zipcode: String,
        country: String
      },
      discount:{
        type: Number,
      },  
      averageRating: {
        type: Number,
        min: [1, "Rating must be at least 1"],
        max: [10, "Rating must can not be more than 10"]
      },
      bar: {
        type: Boolean,
        required: [true, "Please mention about the bar"]
      },
      nonVeg: {
        type: Boolean,
        required: [true, "Please mention Veg/Non veg"]
      },
      tableBooking: {
        type: Boolean,
        required: [true, "mention table booking availability"]
      },
      acceptCard: {
        type: Boolean,
        required: [true, "Mention whether card is accepted"] 
      },
      photo: {
        type: String,
        default: "no-photo.jpg"
      },
      createdAt: {
        type: Date,
        default: Date.now
      },
      user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true
      }
    },
    {
      toJSON: { virtuals: true },
      toObject: { virtuals: true }
    }
  );

  //Create bootcamp slump from the name
  RestuarantSchema.pre('save',function(next){
    this.slug = slugify(this.name,{lower:true});
    next();
  });

  //Geocode & create location field
  RestuarantSchema.pre('save', async function(next){
    const loc = await geocoder.geocode(this.address);
    this.location = {
      type: 'Point',
      coordinates: [loc[0].longitude, loc[0].latitude],
      formattedAddress: loc[0].formattedAddress,
      street: loc[0].streetName,
      city: loc[0].city,
      state: loc[0].stateCode,
      zipcode: loc[0].zipcode,
      country: loc[0].countryCode,
    };

  })

  //Reverse populate with virtuals
  RestuarantSchema.virtual('menus',{
    ref:'Menu',
    localField:'_id',
    foreignField: 'restuarant',
    justOne: false
  });

  module.exports = mongoose.model('Restuarant',RestuarantSchema);