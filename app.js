const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const listingSchema = require("./schema.js");

app.use(methodOverride("_method"));


app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));

app.use(express.urlencoded({extended:true}));
app.engine('ejs',ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

let Mongo_url = 'mongodb://127.0.0.1:27017/wanderlust';

main()
  .then((res) => {
    console.log("connection establish !");
  })
  .catch((err) => {
    console.log(err);
  });

async function main(){
    await mongoose.connect(Mongo_url);
}

app.get("/",(req,res)=>{
    res.send("root path");
})

const validateListing  = (req,res,next)=>{
  let {error} = listingSchema.validate(req.body);
  console.log(error);
  if(error){
    throw new ExpressError(400,error)
  }else{
    next();
  }
}

//create route

app.post("/listings",validateListing,wrapAsync(async (req, res, next) => {
    // let {title,description,image,price,location,country} = req.body;
    // let listing = req.body.listing; //gives JS object
  
    const newListing = new Listing(req.body.listing);
    console.log(newListing);
    await newListing.save();
    res.redirect("/listings");
  })
);

//new route

app.get("/listings/new",(req,res)=>{
    res.render("listings/new.ejs")
})

//show route

app.get("/listings/:id",wrapAsync(async(req,res)=>{
  let {id} = req.params;
  const listing = await Listing.findById(id);
  res.render("listings/show.ejs",{listing});
})
)

//edit route

app.get("/listings/:id/edit",wrapAsync(async(req,res)=>{
  let {id} = req.params;
  const listing  = await Listing.findById(id);
  res.render("listings/edit.ejs",{listing});
}
));

//update route

app.put("/listings/:id",validateListing,wrapAsync(async(req,res)=>{
  let {id} = req.params;
  await Listing.findByIdAndUpdate(id,{...req.body.listing});
  res.redirect("/listings");
})
);

//delete route

app.delete("/listings/:id",wrapAsync(async(req,res,next)=>{
  let {id} = req.params;
  await Listing.findByIdAndDelete(id);
  res.redirect("/listings");
})
);

//index route for listings

app.get("/listings",wrapAsync(async(req,res)=>{
  const allListings = await Listing.find({});
  res.render("listings/index.ejs",{allListings});
})
);



// app.get("/listingtest",async (req,res)=>{
//     let sample = new Listing({
//         title:"varanasi villa",
//         description: "By the ganga",
//         price:800,
//         location:"banaras up",
//         country:"india"

//     }) 

//     await sample.save();
//     console.log("data saved");
//     res.send("successful testing phase completed");
// })

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