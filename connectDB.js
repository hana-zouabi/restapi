const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("Database Connected good for you :) ");
  } catch (error) {
    console.error("error", error.message);
  }
};
module.exports = connectDB;
