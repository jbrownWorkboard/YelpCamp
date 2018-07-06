var express                 = require("express"),
    app                     = express(),
    mongoose                = require("mongoose"),
    passport                = require("passport"),
    LocalStrategy           = require("passport-local"),
    passportLocalMongoose   = require("passport-local-mongoose"),
    bodyParser              = require("body-parser"),
    User                    = require("./models/user"),
    Campground              = require("./models/campground"),
    Comment                 = require("./models/comment"),
    seedDB                  = require("./public/js/seeds");

var commmentRoutes          = require("./routes/comments"),
    campgroundRoutes        = require("./routes/campgrounds"),
    indexRoutes             = require("./routes/index");

//This Yelpcamp version will include authentication and other fun stuff.
mongoose.connect("mongodb://localhost/yelp_camp"); //Creates yelp_camp DB (if it doesn't already exist).
app.use(express.static(__dirname + "/public")); //Give app access to the 'public' folder
app.use(express.static("node_modules/jquery/dist/")); //Allow access to the jQuery node module for Bootstrap.
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
seedDB();

//=================================
//   PASSPORT AUTH CONFIGURATION
//=================================

//Enable sessions
app.use(require("express-session")({
    secret: "sseeccrreett",
    resave: false,
    saveUninitialized: false
    }));

//Use Passport in App.js
app.use(passport.initialize());
app.use(passport.session());

//Make User Data Model & Schema
passport.use(new LocalStrategy(User.authenticate())); //Tell Passport to use "Local Strategy" (not Google/Facebook etc.);
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(indexRoutes);
app.use(campgroundRoutes);
app.use(commmentRoutes); 


//CLOUD 9
//Start Server and listen for requests
// app.listen(process.env.PORT, process.env.IP, function() {
//   console.log("YelpCamp Server Started");  
// });

//LOCALHOST
app.listen(3000, 'localhost', function() {
    console.log("YelpCamp Server Started on localhost");
});