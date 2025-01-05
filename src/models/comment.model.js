import mongoose,{Schema} from "mongoose"

const commentSchema=new Schema(
    {
        content:{
            type:String,
        },
        owner:{
            type:Schema.Types.ObjectId,
            ref:"User"
        },
        video:{
            type:Schema.Types.ObjectId,
            ref:"video"
        }
    },
    {
        timestamps:true
    }
);

export const Comment=mongoose.model("Comment",commentSchema);
