import mongoose from 'mongoose';

let connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log('successfully connected to db');
    } catch (error) {
        console.log('error while connecting to db' , error)
    }
}

export default connectDB