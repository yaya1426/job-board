import mongoose, { Mongoose } from "mongoose";

const MONGO_URI = process.env.MONGO_URI;

interface MongooseCache {
  conn: Mongoose | null;
  promise: Promise<Mongoose> | null;
}

declare global {
  var mongooseCache: MongooseCache | undefined;
}

const cached: MongooseCache = global.mongooseCache ?? {
  conn: null,
  promise: null,
};

if (!global.mongooseCache) {
  global.mongooseCache = cached;
}

export async function dbConnect(): Promise<Mongoose> {
  if (cached.conn) return cached.conn;

  if (!MONGO_URI) {
    throw new Error("MONGODB_URI is not defined");
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGO_URI, {
      bufferCommands: false,
    });
  }

  console.log("Connecting to MongoDB", MONGO_URI);

  cached.conn = await cached.promise;

  console.log("Connected to MongoDB", cached.conn);

  return cached.conn;
}
