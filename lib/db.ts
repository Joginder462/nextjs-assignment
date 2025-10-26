import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
  throw new Error("MONGODB_URI is not set");
}

type GlobalWithMongoose = typeof globalThis & {
  _mongoose?: {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
  };
};

const g = global as GlobalWithMongoose;

if (!g._mongoose) {
  g._mongoose = { conn: null, promise: null };
}

export async function dbConnect() {
  if (g._mongoose!.conn) return g._mongoose!.conn;
  if (!g._mongoose!.promise) {
    g._mongoose!.promise = mongoose.connect(MONGODB_URI, { dbName: "pmtool" });
  }
  g._mongoose!.conn = await g._mongoose!.promise;
  return g._mongoose!.conn;
}
