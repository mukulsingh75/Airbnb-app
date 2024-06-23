const User = require("../models/user.js");

module.exports.renderSignupForm = (req,res)=>{
    res.render("users/signup.ejs");
};

module.exports.renderLoginForm = (req,res)=>{
    res.render("users/login.ejs");
};

module.exports.signUp = async(req,res)=>{
    try{
        let {username,email,password} = req.body;
        const newuser = new User({email,username});
        let regUser = await User.register(newuser,password);
        console.log(regUser);
        req.login(regUser,(err)=>{   //here we login user just after signup
            if(err){
            return next(err);
            }
            req.flash("success","Welcome to wanderlust");
            res.redirect("/listings");
        })
        
    }catch(e){
        req.flash("error",e.message);
        res.redirect("/signup");
    }
};

module.exports.login = async (req, res) => {
    req.flash("success","Welcome back to wanderlust");
    let url = res.locals.redirectUrl || "/listings";
    res.redirect(url);
  };

module.exports.logout = (req,res,next)=>{
    req.logout((err)=>{
     if(err){
         return next(err);
     }
     req.flash("success","you are logout successfully");
     res.redirect("/listings");
    })
 };  