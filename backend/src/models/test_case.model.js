import mongoose from "mongoose";

const test_caseSchema=new mongoose.Schema({
   input_data:{
    type:String,
    required:true,
  },
  expected_output:{
     type:String,
     required:true
  },
  is_hidded:{
    type:Boolean,
    require:true,
    default:false
  },
  problem_id:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Problem"
  }
});

const Test_Case= mongoose.model("Test_Case",test_caseSchema);
export  default Test_Case;