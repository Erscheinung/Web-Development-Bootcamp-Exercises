var express               = require("express"),
    mongoose              = require("mongoose"),
    passport              = require("passport"),
    bodyParser            = require("body-parser"),
    User                  = require("./models/user"),
    LocalStrategy         = require("passport-local"),
    passportLocalMongoose = require("passport-local-mongoose");


mongoose.connect("mongodb://localhost:27017/auth_demo_app", { useNewUrlParser: true })

var app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(require("express-session")({
    secret: "Kadhi sux",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//==================
// ROUTES
//==================




app.get("/",function(req,res){
    res.render("home");
});

app.get("/secret",isLoggedIn, function(req,res){
   res.render("secret"); 
});

//Auth Routes
//show sign up form
app.get("/register",function(req,res){
   res.render("register"); 
});
//handling user sign up
app.post("/register",function(req,res){
   req.body.username
   req.body.password
   User.register(new User({username: req.body.username}), req.body.password, function(err, user){
      if(err){
          console.log(err);
          return res.render("register");
      } 
      passport.authenticate("local")(req,res, function(){
         res.redirect("/secret");
      });
   });
});

// LOGIN ROUTES

//render login form
app.get("/login", function(req, res){
    res.render("login");
});

//login logic
app.post("/login", passport.authenticate("local", { //used inside app.post as (middleware - code that runs before final callback)
        successRedirect: "/secret",
        failureRedirect: "/login",
    }), function(req, res){
});

//logout logic
app.get("/logout", function(req, res){
    // res.send("TESTING");
    req.logout(); //logs them out via passport
    res.redirect("/");
});

function isLoggedIn(req, res, next) { //next is the next thing that needs to be called.
    if (req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

app.listen(process.env.PORT, process.env.IP, function(){
   console.log("Server started"); 
});