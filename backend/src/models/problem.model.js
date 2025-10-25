import mongoose from "mongoose";

const problemSchema =new mongoose.Schema({
    title:{
        type:String,
    },
    description:{
        type:String,
        required:true
    },
    start_code:{
        type:String,
        required:true
    },
    solution:{
        type:String,
        required:true
    },
    problem_type:{
        type:String,
        required:true
    },
     problemset_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"ProblemSet",
     }
},
{
      timestamps: { createdAt: "created_at", updatedAt: false },
}
     
)

const Problem = mongoose.model("Problem",problemSchema);
export default Problem;