const express= require("express");
const app=express();
const mongoose=require("mongoose");
const path=require('path');
const bcrypt=require("bcrypt")

const collectionstudent=require("./configstudent")
const collectionorganiser=require("./configorganiser")
const collectionfaculty=require("./configfaculty")
const Sport=require("./sport")
const Workshop=require("./workshop")
const Seminar=require("./seminar")



//const Chat=require("./models/chat.js");
app.set("view engine","ejs");
app.use(express.static("public"));
app.use(express.urlencoded({extended:true}))
const methodoverride=require("method-override");
app.use(methodoverride("_method"))




app.get("/",(req,res)=>{
    res.render("home")
})
app.get("/events/new",(req,res)=>{
    res.render("newevent.ejs");
})

app.get("/login",(req,res)=>
{
    res.render("login");
})

app.get('/signup',(req,res)=>
{
    res.render("signup")
})

app.get('/studentsignup',(req,res)=>
{
    res.render("studentsignup")
})


app.get('/facultysignup',(req,res)=>
{
    res.render("facultysignup")
})


app.get('/organisersignup',(req,res)=>
{
    res.render("organisersignup")
})


app.get('/studentlogin',(req,res)=>
{
    res.render("studentlogin")
})


app.get('/facultylogin',(req,res)=>
{
    res.render("facultylogin")
})

app.get("/organiserlogin",(req,res)=>
{
    res.render("organiserlogin")
})

app.get('/organisersignup',(req,res)=>
{
    res.render("organisersignup")
})

app.post("/studentsignup",async(req,res)=>
{
    const data=new collectionstudent({
        name:req.body.username,
        password:req.body.password,
        email:req.body.email,
        rgukt_id:req.body.rgukt_id

    })

    const existingUser=await collectionstudent.findOne({name:data.name})
    if(existingUser)
    {
        res.send("user name already exists");
    }
    else
    {
        const saltRounds=10
        const hashPassword=await bcrypt.hash(data.password,saltRounds)
        data.password=hashPassword
        data.save();
    }

})

app.post("/organisersignup",async(req,res)=>
{
    const data=new collectionorganiser({
        name:req.body.username,
        password:req.body.password,
        email:req.body.email,

    })

    const existingUser=await collectionorganiser.findOne({name:data.name})
    if(existingUser)
    {
        res.send("user name already exists");
    }
    else
    {
        const saltRounds=10
        const hashPassword=await bcrypt.hash(data.password,saltRounds)
        data.password=hashPassword
        data.save();
    }

})

app.post("/facultysignup",async(req,res)=>
{
    const data=new collectionfaculty({
        name:req.body.username,
        password:req.body.password,
        email:req.body.email
    })

    const existingUser=await collectionfaculty.findOne({name:data.name})
    if(existingUser)
    {
        res.send("user name already exists");
    }
    else
    {
        const saltRounds=10
        const hashPassword=await bcrypt.hash(data.password,saltRounds)
        data.password=hashPassword
        data.save();
    }

})

app.post("/studentlogin",async(req,res)=>
{
    const username=req.body.username;
    const password=req.body.password;
    const existingUser=await collectionstudent.findOne({name:req.body.username})
    if(!existingUser)
    {
        res.send("username doesn't exist")
    }
    const isPassword=await bcrypt.compare(req.body.password,existingUser.password)
    let sports= await Sport.find().sort({event_at:1}).limit(3);
    let seminars= await Seminar.find().sort({event_at:1}).limit(3);
    let workshops= await Workshop.find().sort({event_at:1}).limit(3);
    if(isPassword)
    {
        res.render("student",{sports,seminars,workshops});
    }
    else
    {
        res.send("wrong password")
    }
})

app.post("/organiserlogin",async(req,res)=>
{
    const username=req.body.username;
    const password=req.body.password;
    const existingUser=await collectionorganiser.findOne({name:req.body.username})
    if(!existingUser)
    {
        res.send("username doesn't exist")
    }
    const isPassword=await bcrypt.compare(req.body.password,existingUser.password)
    if(isPassword)
    {
        res.redirect("organiser")
    }
    else
    {
        res.send("wrong password")
    }
    

})
app.post("/facultylogin",async(req,res)=>
{
    const username=req.body.username;
    const password=req.body.password;
    const existingUser=await collectionfaculty.findOne({name:req.body.username})
    if(!existingUser)
    {
        res.send("username doesn't exist")
    }
    const isPassword=await bcrypt.compare(req.body.password,existingUser.password)
    let sports= await Sport.find().sort({event_at:1}).limit(3);
    let seminars= await Seminar.find().sort({event_at:1}).limit(3);
    let workshops= await Workshop.find().sort({event_at:1}).limit(3);
    if(isPassword)
    {
        res.render("student",{sports,seminars,workshops});
    }
    else
    {
        res.send("wrong password")
    }
    
    

})

app.get("/organiser",async (req,res)=>{
    let sports= await Sport.find().sort({event_at:1}).limit(3);
    let seminars= await Seminar.find().sort({event_at:1}).limit(3);
    let workshops= await Workshop.find().sort({event_at:1}).limit(3);
    res.render("organiser",{sports,seminars,workshops});
})

app.get("/events/new",(req,res)=>{
    res.render("newevent.ejs");
})
app.post("/organiser/events",(req,res)=>{
    let {event_type,event_title,event_description,event_after,location,start_time,end_time,duration}=req.body;
    let event_at = new Date();
    event_at.setDate(event_at.getDate() + Number(event_after));
    if(event_type == "sport"){
        let newevent=new Sport({
            event_type:event_type,
            event_title:event_title,
            event_description:event_description,
            event_at:event_at,
            location:location,
            start_time:start_time,
            end_time:end_time,
            duration:duration
        })
        newevent.save().then(res =>{console.log("event was saved")});
    }
        else if(event_type == "seminar"){
        let newevent=new Seminar({
            event_type:event_type,
            event_title:event_title,
            event_description:event_description,
            event_at:event_at,
            location:location,
            start_time:start_time,
            end_time:end_time,
            duration:duration
        })
        newevent.save().then(res =>{console.log("event was saved")});
    }
    else if(event_type == "workshop"){
        let newevent=new Workshop({
            event_type:event_type,
            event_title:event_title,
            event_description:event_description,
            event_at:event_at,
            location:location,
            start_time:start_time,
            end_time:end_time,
            duration:duration
        })
        newevent.save().then(res =>{console.log("event was saved")});
    }
    res.redirect("/organiser");
})



app.get("/newevent",(req,res)=>
{
    res.render("newevent")
})

app.get("/sports",async (req,res)=>{
    let sports= await Sport.find();
    res.render("sports",{sports})
})
app.get("/seminars", async(req,res)=>{
    let seminars= await Seminar.find();
    res.render("seminars",{seminars})
})
app.get("/workshops", async (req,res)=>{
    let workshops= await Workshop.find();
    res.render("workshops",{workshops})
})
app.get("/sports/:id/edit",async (req,res)=>{
    let {id}=req.params;
    let sport= await Sport.findById(id);
    res.render("sportedit.ejs",{sport});
})
app.get("/seminars/:id/edit",async (req,res)=>{
    let {id}=req.params;
    let seminar= await Seminar.findById(id);
    res.render("seminaredit.ejs",{seminar});
})
app.get("/workshops/:id/edit",async (req,res)=>{
    let {id}=req.params;
    let workshop= await Workshop.findById(id);
    res.render("workshopedit.ejs",{workshop});
})
app.put("/sports/:id",async (req,res)=>{
    let {id}=req.params;
    let {event_title,event_description,event_after,location,start_time,end_time,duration}=req.body;

    event_at = new Date();
    event_at.setDate(event_at.getDate() + Number(event_after));

    let updatedchat=await Sport.findByIdAndUpdate(id,{event_title:event_title,event_description:event_description,event_after:event_after,event_at:event_at,location:location,start_time:start_time,end_time:end_time,duration:duration},{runValidators:true , new:true});

    console.log(updatedchat)
    res.redirect("/sports");
})
app.put("/seminars/:id",async (req,res)=>{
    let {id}=req.params;
    let {event_title,event_description,event_after,location,start_time,end_time,duration}=req.body;

    event_at = new Date();
    event_at.setDate(event_at.getDate() + Number(event_after));
    let updatedchat=await Seminar.findByIdAndUpdate(id,{event_title:event_title,event_description:event_description,event_after:event_after,event_at:event_at,location:location,start_time:start_time,end_time:end_time,duration:duration},{runValidators:true , new:true});

    console.log(updatedchat)
    res.redirect("/seminars");
})
app.put("/workshops/:id",async (req,res)=>{
    let {id}=req.params;
    let {event_title,event_description,event_after,location,start_time,end_time,duration}=req.body;

    event_at = new Date();
    event_at.setDate(event_at.getDate() + Number(event_after));

    let updatedchat=await Workshop.findByIdAndUpdate(id,{event_title:event_title,event_description:event_description,event_after:event_after,event_at:event_at,location:location,start_time:start_time,end_time:end_time,duration:duration},{runValidators:true , new:true});

    console.log(updatedchat)
    res.redirect("/workshops");
})

app.delete("/sports/:id",async (req,res)=>{
    let {id}=req.params;
    await Sport.findByIdAndDelete(id);
    res.redirect("/sports")
})
app.delete("/seminars/:id",async (req,res)=>{
    let {id}=req.params;
    await Seminar.findByIdAndDelete(id);
    res.redirect("/seminars")
})
app.delete("/workshops/:id",async (req,res)=>{
    let {id}=req.params;
    await Workshop.findByIdAndDelete(id);
    res.redirect("/workshops")
})


const port=4008

app.listen(port,()=>
{
    console.log("server is running in port"+port)
})
