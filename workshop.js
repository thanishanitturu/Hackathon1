const mongoose = require("mongoose");
let workshopSchema=new mongoose.Schema({
    event_type:{
        type:String,
        required:true,
        maxlength:20
    },
    event_title:{
        type:String,
        required:true,
    },
    event_description:{
        type:String,
        required:true,
    },
    event_after:{
        type:Number
    },
    event_at:{
        type:Date,
        required:true
    },
    
    duration:{
        type:String,
        required:true
    },
    start_time:{
        type:String,
        required:true
    },
    end_time:{
        type:String,
        required:true
    },
    location:{
        type:String,
        required:true
    }
})

const Workshop = mongoose.model("Workshop",workshopSchema);
module.exports= Workshop;