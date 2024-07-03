import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGO_URL;

const connect = async () => {
    const connectionState = mongoose.connection.readyState;

    if(connectionState === 1){
        console.log("Already Connected !!!");
        return
    }

    if(connectionState === 2){
        console.log("Connecting ....");
        return
    }

    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to database !!');
    } catch (err) {
        console.error('Error connecting to the database:', err);
        throw new Error('Database connection error');
    }

}

export default connect;