const mongoose=require("mongoose");
const connect=mongoose.connect("mongodb://localhost:27017/events");

connect.then(()=>
{
    console.log("Database successfully connected with community")
})

const ImageSchema=new mongoose.Schema(
    {
        name:
        {
            type:String,
            required:true
        },
        image:
        {
            data:Buffer,
            contentType:String
        }
    }
)

const collection=new mongoose.model("imagemodel",ImageSchema)

module.exports=collection;

