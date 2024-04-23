import mongoose from "mongoose";

mongoose.set('strictQuery', false);

const connectDB = async () => {

    try {
            const connection = await mongoose.connect(`${process.env.MONGO_URI}`)
        
            console.log(`mongodb database connected successfully ${connection.connection.host}`)
    } 
    catch (error) {
        console.log(" error in connecting database ", error)  
        process.exit(1);  
    }
}

export default connectDB;