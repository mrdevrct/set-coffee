const mongoose = require("mongoose");

const connectToDB = async () => {
  try {
    if (mongoose.connections[0].readyState) {
      return true;
    } else {
      await mongoose.connect(process.env.MONGO_URL);
      console.log("connect To DB Successfully :)");
    }
  } catch (e) {
    console.log("DB connection error ", e);
  }
};

export default connectToDB;
