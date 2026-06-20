import mongoose from 'mongoose';

let connectDB = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/auth');
        console.log('successfully connected to db');
    } catch (error) {
        console.log('error while connecting to db' , error)
    }
}

export default connectDB