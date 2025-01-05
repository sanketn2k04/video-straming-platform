import mongoose,{Schema} from "mongoose"

const likesSchema=new Schema(
    {
        likedBy:{
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

export const Like=mongoose.model("Like",likesSchema);
