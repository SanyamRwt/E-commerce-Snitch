import dotenv from "dotenv";
dotenv.config();

import app from "./src/app.js";
import connectDb from "./src/config/db.js";

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    await connectDb();
    console.log("✅ MongoDB Connected");

    app.listen(PORT, () => {
      console.log(`✅ Server listening on port ${PORT}`);
    });
  } catch (err) {
    console.error("❌ Failed to connect MongoDB");
    console.error(err);
    process.exit(1);
  }
};

startServer();