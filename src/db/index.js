import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB=async ()=>{
    try {
        // console.log(process.env.MONOGODB_URL);
        const connectionInstance = await mongoose.connect(`${process.env.MONOGODB_URL}/${DB_NAME}`);
        console.log(`\nDatabase connected !! MongoDB HOST: ${connectionInstance.connection.host}`)
        // console.dir(connectionInstance.connection.host)
    } catch (error) {
        console.log("MongoDB connection ERROR :: ", error);
        process.exit(1);
    }
}

export default connectDB;