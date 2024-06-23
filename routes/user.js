const express = require("express");
const router  = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const {saveRedirectUrl:redirectUrl} = require("../middleware.js");
const userController = require("../controller/user.js");

// sign up routes

router.route("/signup")
  .get(userController.renderSignupForm)
  .post(wrapAsync(userController.signUp));

// login routes

router.route("/login")
  .get(userController.renderLoginForm)
  .post(
    redirectUrl,
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: true
    }),
    userController.login
  );

// logout routes  

router.get("/logout",userController.logout);

module.exports = router;