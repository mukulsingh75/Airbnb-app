const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  image: {
    filename: {
      type:String,
      default:"listingimage"
    },
    url: {
      type: String,
      set: (v) => v === "" ? "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" : v
    }
},
  price: {
    type: Number
  },
  location: {
    type: String
  },
  country: {
    type: String
  }
});

const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;
