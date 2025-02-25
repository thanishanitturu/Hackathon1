const mongoose=require("mongoose")
const connect=mongoose.connect("mongodb://localhost:27017/events");


connect.then(()=>
{
    console.log("Database successfully connected with community")
})

const LoginSchema=new mongoose.Schema(
    {
        name:
        {
            type:String,
            required:true,
        },
        password:
        {
            type:String,
            required:true,
        },
        email:
        {
            type:String,
            required:true,
        },
        img_name:
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
);

const collection=new mongoose.model("organiser",LoginSchema)

module.exports=collection;