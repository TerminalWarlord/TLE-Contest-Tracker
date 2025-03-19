import mongoose from 'mongoose';

let isConnected = false;

export const connectDb = async () => {
    if (isConnected) {
        console.log('Using existing MongoDB connection');
        return;
    }

    try {
        await mongoose.connect(process.env.DATABASE_URL || "");
        isConnected = true;
        console.log('Connected to MongoDB');
    } catch (err) {
        console.error('Failed to connect to MongoDB', err);
        process.exit(1);
    }
};

