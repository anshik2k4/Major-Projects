// dbConnection.js
import mongoose from 'mongoose';

async function main() {
  try {
    await mongoose.connect(process.env.ATLASDB_URL);
    console.log("Database connected successfully");
  } catch (err) {
    console.error("Database connection failed:", err.message);
    // process.exit(1);  // server band kar do agar DB connect nahi hua
  }
}

export default main;