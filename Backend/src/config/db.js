import mongoose from "mongoose";
import { config } from "./config.js";

const connectDb = async () => {


    await mongoose.connect(config.MONGO_URI);
    console.log("MongoDB Connected ");
    
 }

 export default connectDb;