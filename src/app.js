import express, { json } from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser';


const app=express();

app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true
}));
app.use(express.json({limit:'16KB'}));
app.use(express.urlencoded({extended:true,limit:'16KB'}));
app.use(express.static('public'));
app.use(cookieParser());


//routes import

import userRouter from "./routes/user.route.js";
import videoRouter from "./routes/video.route.js";
import commentRouter from "./routes/comment.route.js";


//routes declaration
app.use("/api/v1/users",userRouter);
app.use("/api/v1/videos",videoRouter);
app.use("/api/v1/comments",commentRouter);


app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: err.stack.split("\n")[0].replace("Error: ", "") });
});

export {app};