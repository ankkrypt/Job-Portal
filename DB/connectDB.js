import mongoose from 'mongoose';

// connecting to database
const connectDB = async () => {
    const connectionUrl = process.env.DB_URI;
    mongoose.connect(connectionUrl, { useNewUrlParser: true, useUnifiedTopology: true })
    mongoose.set('strictQuery', false);
};

export default connectDB;