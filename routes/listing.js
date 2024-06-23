const express = require("express");
const router  = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const {isLoggedIn} = require("../middleware.js");
const {isOwner,validateListing} = require("../middleware.js");
const listingController = require("../controller/listing.js");
const multer  = require('multer');
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage });



//index and create route  for listings

router.route("/")
      .get(wrapAsync(listingController.index))
      .post(isLoggedIn,upload.single("listing[image]"),validateListing,wrapAsync(listingController.create));

//new route

router.get("/new",isLoggedIn,listingController.renderNewForm);

//show ,update and delete route for listings

router.route("/:id")
      .get(wrapAsync(listingController.show))
      .put(isLoggedIn,isOwner,upload.single("listing[image]"),validateListing,wrapAsync(listingController.update))
      .delete(isLoggedIn,isOwner,wrapAsync(listingController.destroy));


//edit route

router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingController.renderEditForm));


module.exports = router;
