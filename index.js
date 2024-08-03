const express= require("express");
const app=express();
const multer=require("multer");
const mongoose=require("mongoose");
const path=require('path');
const bcrypt=require("bcrypt");
const session = require("express-session");

const ImageModel=require("./configimage.js");
const collectionstudent=require("./configstudent")
const collectionorganiser=require("./configorganiser")
const collectionfaculty=require("./configfaculty")
const Sport=require("./sport")
const Workshop=require("./workshop")
const Seminar=require("./seminar")
const methodoverride=require("method-override");
const registerSchema=require("./register");
const volunteerSchema=require("./volunteerRegister.js")

//const Chat=require("./models/chat.js");
app.set("view engine","ejs");
app.use(express.static("public"));
app.use(express.urlencoded({extended:true}))
app.use(methodoverride("_method"))
app.set('views', path.join(__dirname, 'views'));


const storage = multer.memoryStorage();
const upload = multer({ storage }).single("profileImage");


app.use(session({
    secret: 'your_secret_key', // Replace with a strong secret key
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } // Set to true if using HTTPS
}));


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

app.get("/organiser",async (req,res)=>{
    let sports= await Sport.find({event_at:{$gt:Date.now()}}).sort({event_at:1}).limit(3);
    let seminars= await Seminar.find({event_at:{$gt:Date.now()}}).sort({event_at:1}).limit(3);
    let workshops= await Workshop.find({event_at:{$gt:Date.now()}}).sort({event_at:1}).limit(3);
    const profile = req.session.user;
    res.render("organiser",{profile,sports,seminars,workshops});

})

app.get("/newevent/:name",(req,res)=>
{
    profile=req.params.name
    res.render("newevent",{profile})
})

app.get("/sports",async (req,res)=>{
    let sports= await Sport.find();
    res.render("sports",{sports})
})
app.get("/sports_student",async(req,res)=>
{
    let sports=await Sport.find();
    res.render("sports_student",{sports});
})

app.get("/seminars", async(req,res)=>{
    let seminars= await Seminar.find();
    res.render("seminars",{seminars})
})
app.get("/seminars_student",async(req,res)=>
{
    let seminars= await Seminar.find();
    res.render("seminars_student",{seminars})
})

app.get("/workshops", async (req,res)=>{
    let workshops= await Workshop.find();
    res.render("workshops",{workshops})
})
app.get("/workshops_student", async (req,res)=>{
    let workshops= await Workshop.find();
    res.render("workshops_student",{workshops})
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

app.get('/image/:imgName', async (req, res) => {
    try {
        const imgName = req.params.imgName;
        const user = await collectionorganiser.findOne({ img_name: imgName });
        if (!user) {
            return res.status(404).send('Image not found');
        }

        res.set('Content-Type', user.image.contentType);
        res.send(user.image.data);
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});

app.get("/register/:name/:type",(req,res)=>
{
    let name1=req.params.name;
    let type1=req.params.type;
    res.render("register",{name1,type1})
})

app.get("/register_volunteer/:name",(req,res)=>
{
    const name=req.params.name
    res.render("register_volunteer",{name})
})

app.get("/submit",(req,res)=>
{
    const event=req.session.eventName;
    res.render("submit",{event})
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
    res.redirect("/studentlogin")
})

app.post("/organisersignup",async(req,res)=>
{
    
    
    // const data=new collectionorganiser({
    //     name:req.body.username,
    //     password:req.body.password,
    //     email:req.body.email,

    // })

    // const existingUser=await collectionorganiser.findOne({name:data.name})
    // if(existingUser)
    // {
    //     res.send("user name already exists");
    // }
    // else
    // {
    //     const saltRounds=10
    //     const hashPassword=await bcrypt.hash(data.password,saltRounds)
    //     data.password=hashPassword
    //     data.save();
    // }
    upload(req,res,async(err)=>
    {



        const profile=new collectionorganiser({
        name:req.body.username,
        password:req.body.password,
        email:req.body.email,
        img_name:req.file.originalname,
                    image:{
                        // data:req.file.filename,
                        data:req.file.buffer,
                        // contentType:"image/png"
                        contentType:req.file.mimetype
                    }

    })

    const existingUser=await collectionorganiser.findOne({name:profile.name})
    if(existingUser)
    {
        res.send("user name already exists");
    }
    else
    {
        const saltRounds=10
        const hashPassword=await bcrypt.hash(profile.password,saltRounds)
        profile.password=hashPassword
        profile.save();
    }
        // if(err)
        // {
        // console.log(err)
        // }
        // else
        // {
        //     const newImage=new ImageModel(
        //         {
        //             name:req.file.originalname,
        //             image:{
        //                 // data:req.file.filename,
        //                 data:req.file.buffer,
        //                 // contentType:"image/png"
        //                 contentType:req.file.mimetype
        //             }
        //         }
        //     )
        //     newImage.save();
        // }
        res.redirect("/organiserlogin");
    })   
 

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
    res.redirect("/facultylogin")

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
    let sports= await Sport.find({event_at:{$gt:Date.now()}}).sort({event_at:1}).limit(3);
    let seminars= await Seminar.find({event_at:{$gt:Date.now()}}).sort({event_at:1}).limit(3);
    let workshops= await Workshop.find({event_at:{$gt:Date.now()}}).sort({event_at:1}).limit(3);
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
        req.session.user = existingUser;
        res.redirect("organiser")
    }
    else
    {
        res.send("wrong password")
    }
    // try {
    // const image = await configorganiser.findOne({ name: req.params.name });
    // if (!image) {
    //     return res.status(404).send("Image not found");
    // }
    // res.contentType(image.image.contentType);
    // res.send(image.image.data);
    // } catch (err) {
    // res.status(500).send("Error retrieving image");
    // }

    

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
    let sports= await Sport.find({event_at:{$gt:Date.now()}}).sort({event_at:1}).limit(3);
    let seminars= await Seminar.find({event_at:{$gt:Date.now()}}).sort({event_at:1}).limit(3);
    let workshops= await Workshop.find({event_at:{$gt:Date.now()}}).sort({event_at:1}).limit(3);
    if(isPassword)
    {
        res.render("student",{sports,seminars,workshops});
    }
    else
    {
        res.send("wrong password")
    }
    
    

})


app.post("/organiser/events/:profile",async(req,res)=>{
    let {event_type,event_title,event_description,event_after,location,start_time,end_time,duration,volunteer}=req.body;
    let event_at = new Date();
    const volunteerdb=mongoose.model("volunteer",volunteerSchema);
    event_at.setDate(event_at.getDate() + Number(event_after));
    let vol=new volunteerdb(
        {
            name:event_type,
            count:volunteer
        }
    )
    await vol.save().then(res =>{console.log("event was saved")});
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
        await newevent.save().then(res =>{console.log("event was saved")});
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
        await newevent.save().then(res =>{console.log("event was saved")});
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
        await newevent.save().then(res =>{console.log("event was saved")});
    }
    let sports= await Sport.find({event_at:{$gt:Date.now()}}).sort({event_at:1}).limit(3);
    let seminars= await Seminar.find({event_at:{$gt:Date.now()}}).sort({event_at:1}).limit(3);
    let workshops= await Workshop.find({event_at:{$gt:Date.now()}}).sort({event_at:1}).limit(3);
    const name=req.params.profile
    const User=await collectionorganiser.findOne({name:name})
    console.log(User)
    const profile=User
    res.render("organiser",{profile,sports,seminars,workshops});
})

app.post("/studentRegister/:event_name",(req,res)=>
{
    const event_name=decodeURIComponent(req.params.event_name)
    const register=mongoose.model("registration",registerSchema)
    req.session.eventName=req.params.event_name;
    let {type,name,email,phone,student_id}=req.body;
    let newRegister=new register(
        {
            event_type:type,
            event_name:event_name,
            name:name,
            email:email,
            phone:phone,
            student_id:student_id
        }
    )
    newRegister.save();
    res.redirect("/submit")
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


const port=7600

app.listen(port,()=>
{
    console.log("server is running in port"+port)
})
