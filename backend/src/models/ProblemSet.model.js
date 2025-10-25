import mongoose from "mongoose";

const ProblemsetSchema=new mongoose.Schema({
       problemset_name:{
        type:String,
        required:true
     },
     description:{
        type:String,
        required:true,
     },
     programming_languages:{
        type:String,
     },
     difficulty:{
        type:String,
        enum:["easy","medium","hard"],
        required:true,
        default:"easy"
     },
    },
    {
    timestamps: { createdAt: "created_at", updatedAt: false },
  }
);

const Problem_set=mongoose.model("ProblemSet",ProblemsetSchema);
export default Problem_set