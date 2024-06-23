// if(process.enc.NODE_ENV != "production"){
  require("dotenv").config();


const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");




const listingsRouter = require("./routes/listing.js");
const reviewsRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

// let Mongo_url = 'mongodb://127.0.0.1:27017/wanderlust';
let Url = process.env.ATLAS_URL;

main()
  .then((res) => {
    console.log("connection establish !");
  })
  .catch((err) => {
    console.log(err);
  });

async function main(){
    await mongoose.connect(Url);
}

app.use(methodOverride("_method"));


app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));

app.use(express.urlencoded({extended:true}));
app.engine('ejs',ejsMate);
app.use(express.static(path.join(__dirname,"/public")));


// app.get("/",(req,res)=>{
//   res.send("root path");
// })

const store = MongoStore.create({
  mongoUrl : Url,
  crypto: {             //encryption
    secret : "supersecretcode",
  },
  touchAfter : 24 * 3600    //session time
});

store.on("error",()=>{
  console.log("Error in Mongo Session Store",error);
})

const sessionOptions = {
  store:store,
  secret: "supersecretcode",
  resave: false,
  saveUninitialized: true,
  cookie : {
    expires : Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge : 7 * 24 * 60 * 60 * 1000,
    httpOnly : true 
  }
};

app.use(session(sessionOptions));
app.use(flash());


//passport middlewares ---> Start

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//end

app.use((req,res,next)=>{
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
})

//demo user

// app.get("/demouser",async(req,res)=>{
//   let fakeUser = new User({
//     email:"mukul@gmail.com",
//     username: "happy"
//   })

//   let demo = await User.register(fakeUser,"happy");
//   res.send(demo);
// });


app.use("/listings",listingsRouter);
app.use("/listings/:id/reviews",reviewsRouter);
app.use("/",userRouter);


app.all("*",(req,res,next)=>{
  next(new ExpressError(404,"page not found"));
})

      //error handling middleware

app.use((err,req,res,next)=>{
  let {statusCode=500,message="something went wrong"} = err;
  res.status(statusCode).render("listings/error.ejs",{err});
  // res.status(statusCode).send(message);
})

app.listen(8080,()=>{
    console.log("Server is listening on port 8080");
})