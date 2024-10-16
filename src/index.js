import dotenv from 'dotenv'
import connectDB from './db/index.js'
import { app } from './app.js'

const port=process.env.PORT;

dotenv.config({
    path:'./env'
})

connectDB()
    .then(()=>{
        app.listen(port,()=>{
            console.log(`App is listning on port ${port}`);
        })        
    })
    .catch((error)=>{
        console.log("MONGO db connection failed :: ", error);
    })