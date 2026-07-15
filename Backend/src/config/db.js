import mongoose from "mongoose";
import { config } from "./config.js";

const connectDb = async () => {
  try {
    console.log("Connecting to:", config.MONGO_URI);

    await mongoose.connect(config.MONGO_URI);

    console.log("✅ MongoDB Connected");
  } catch (err) {
    console.error("MongoDB Error:");
    console.error(err);
    throw err;
  }
};

export default connectDb;