
const fs = require("fs");
const mongoose = require("mongoose");
const colors = require('colors');
const dotenv = require("dotenv");

//load env vars
dotenv.config({ path: "./config/config.env" });

//load models
const Restuarent = require("./dist/models/Restuarent");
const Menu = require("./dist/models/Menu");
const Order = require("./dist/models/Order");
const User = require("./dist/models/User");

//Connect to DB
const conn = mongoose.connect(process.env.MongoURI, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true
});

  //Read JSON files
  const restuarents = JSON.parse(fs.readFileSync(`${__dirname}/_data/restuarents.json`));
  const menus = JSON.parse(fs.readFileSync(`${__dirname}/_data/menus.json`));
  const orders = JSON.parse(fs.readFileSync(`${__dirname}/_data/orders.json`));
  const users = JSON.parse(fs.readFileSync(`${__dirname}/_data/users.json`));

  const importData = async() => {
      try{
        await Restuarent.create(restuarents);
        await Menu.create(menus);
        await Order.create(orders);
        await User.create(users);
        console.log("Data imported...");
        process.exit();
      }catch(err){
        console.error(err);
      }
  };

  const deleteData = async() => {
    try{
      await Restuarent.deleteMany();
      await Menu.deleteMany();
      await Order.deleteMany();
      await User.deleteMany();
      console.log("Data deleted...");
      process.exit();
    }catch(err){
      console.error(err);
    }
};

if (process.argv[2] =="-i"){
    importData();
}else if(process.argv[2] =="-d"){
    deleteData();
};
