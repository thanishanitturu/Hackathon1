const mongoose=require("mongoose");
let volunteerSchema=new mongoose.Schema(
    {  
        name:
        {
            type:String,
            required:true,
        },
        count:
        {
            type:Number,
            required:true,
        }
    }
)
module.exports=volunteerSchema