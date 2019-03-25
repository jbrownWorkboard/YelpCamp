var express                 = require("express"),
    app                     = express(),
    mongoose                = require("mongoose"),
    passport                = require("passport"),
    LocalStrategy           = require("passport-local"),
    passportLocalMongoose   = require("passport-local-mongoose"),
    bodyParser              = require("body-parser"),
    methodOverride          = require("method-override"),
    flash                   = require("connect-flash"),
    User                    = require("./models/user"),
    Campground              = require("./models/campground"),
    Comment                 = require("./models/comment"),
    seedDB                  = require("./public/js/seeds");

//requiring routes from separate route files
var commmentRoutes          = require("./routes/comments"),
    campgroundRoutes        = require("./routes/campgrounds"),
    indexRoutes             = require("./routes/index");

//This Yelpcamp version will include authentication and other fun stuff.
//mongoose.connect("mongodb://localhost/yelp_camp"); //Creates yelp_camp DB (if it doesn't already exist).
mongoose.connect("mongodb://josh:q12345@ds018568.mlab.com:18568/yelpcamp"); //Creates yelp_camp DB (if it doesn't already exist).

app.use(express.static(__dirname + "/public")); //Give app access to the 'public' folder
app.use(express.static("node_modules/jquery/dist/")); //Allow access to the jQuery node module for Bootstrap.
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.set("view engine", "ejs");


//seedDB();  //Seed the database

//=================================
//   PASSPORT AUTH CONFIGURATION
//=================================

//Enable sessions
app.use(require("express-session")({
    secret: "sseeccrreett",
    resave: false,
    saveUninitialized: false
    }));
app.use(flash());
app.use(function(req, res, next) {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});
app.locals.moment = require('moment');
//Use Passport in App.js
app.use(passport.initialize());
app.use(passport.session());

//Make User Data Model & Schema
passport.use(new LocalStrategy(User.authenticate())); //Tell Passport to use "Local Strategy" (not Google/Facebook etc.);
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//tell app to use these routes. Can refactor route names and add "MergeParams=True" 
app.use(indexRoutes);
app.use(campgroundRoutes);
app.use(commmentRoutes); 

// if (process.env.PORT != 'undefined') {
//     app.listen(3000, 'localhost', function() {
//         console.log("YelpCamp Server Started on localhost");
//     })
// } else {
    app.listen(process.env.PORT, process.env.IP, function() {
    console.log("YelpCamp Server Started on Cloud9");  
     });
//}