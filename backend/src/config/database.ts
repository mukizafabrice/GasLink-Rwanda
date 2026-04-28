import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/gaslink_db';

export const connectToDatabase = async () => {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  await mongoose.connect(MONGODB_URI, {
    serverSelectionTimeoutMS: 10000
  });

  console.log(`MongoDB connected: ${mongoose.connection.host}/${mongoose.connection.name}`);

  return mongoose.connection;
};

export const disconnectFromDatabase = async () => {
  if (mongoose.connection.readyState === 0) {
    return;
  }

  await mongoose.disconnect();
};
