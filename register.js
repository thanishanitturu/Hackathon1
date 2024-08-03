const mongoose=require("mongoose");
let registerSchema=new mongoose.Schema(
    {  
        event_type:
        {
            type:String,
            required:true
        },
        event_name:
        {
            type:String,
            required:true,
        },
        name:
        {
            type:String,
            required:true
        },
        email:
        {
            type:String,
            required:true,
        },
        phone:
        {
            type:String,
            required:true,
        },
        student_id:
        {
            type:String,
            required:true
        }

    }
)
module.exports=registerSchema