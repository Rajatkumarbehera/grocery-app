import mongoose from "mongoose";

const mongoUri = process.env.MONGODB_URI;

if (!mongoUri) {
  throw new Error("MONGODB_URI is missing in .env");
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

const connectDB = async () => {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(mongoUri)
      .then((conn) => {
        console.log("MongoDB Connected");
        return conn.connection;
      })
      .catch((error) => {
        console.log("MongoDB connection error:", error);
        throw error;
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
};

export default connectDB;
