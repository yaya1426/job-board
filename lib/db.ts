import mongoose, { Mongoose } from "mongoose";

const MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URI;

const globalWithMongoose = globalThis as typeof globalThis & {
  _mongoose: {
    conn: Mongoose | null;
    promise: Promise<Mongoose> | null;
  };
};

const cached = globalWithMongoose._mongoose ?? {
  conn: null,
  promise: null,
};

globalWithMongoose._mongoose = cached;

export async function dbConnect(): Promise<Mongoose> {
  if (cached.conn) {
    return cached.conn;
  }

  if (!MONGO_URI) {
    throw new Error(
      "MONGO_URI (or MONGODB_URI) environment variable is not set",
    );
  }

  cached.promise ??= mongoose.connect(MONGO_URI, {
    bufferCommands: false,
  });

  cached.conn = await cached.promise;

  return cached.conn;
}
