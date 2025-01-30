import mongoose,{Schema} from "mongoose"
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
const videoSchema=new Schema(
    {
        videoFile:{
            type:Object,
            required:true,
        },
        title:{
            type:String,
            required:true,
        },
        duration:{
            type:Number,
        },
        description:{
            type:String,
        },
        thumbnail:{
            type:String,
            required:true,
        },
        isPublished:{
            type:Boolean,
            default:true,
        },
        owner:{
            type:Schema.Types.ObjectId,
            ref:"User"
        },
        views:{
            type:Number,
            default:0,
        },       

    },
    {
        timestamps:true
    }
)

videoSchema.plugin(mongooseAggregatePaginate)

export const Video=mongoose.model("Video",videoSchema);