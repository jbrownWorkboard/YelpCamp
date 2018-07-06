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

//Middleware to determine if a user is logged on.
function isLoggedIn(req, res, next) {
    var auth = req.isAuthenticated();
    if (auth == true) {
        return next();
    }
    res.redirect("/");
};

//Middleware to determine if a user is an Administrator.gi
function isAdmin(req, res, next) {
    if (typeof(req.user) != 'undefined' && req.user.userlevel == "Administrator") {
        return next();
    }
    res.redirect("/");
}

{//RESTFUL ROUTES: TABLE OF CONTENTS
//name      url                 verb    description
//=======================================================================================
//INDEX     /campgrounds        GET     display list of all campgrounds.
//NEW       /campgrounds/new    GET     display page so user can create new campground
//CREATE    /campgrounds        POST    commit data input by user to the database
//SHOW      /campgrounds/:id    GET     display additional information about a campground

//NESTED ROUTES: So you can associate comments with the particular campground it is related to!!
//NEW       /campgrounds/:id/comments/new   GET
//CREATE    /campgrounds/:id/comments       POST
} //ROUTE GUIDE

// ==============================================================
//              CAMPGROUND USER EXPERIENCE ROUTES
// ==============================================================

//INDEX -- SHOW ALL CAMPGROUNDS
app.get("/campgrounds", function(req, res) {
    //get all campgrounds from DB
    Campground.find({}, function(err, allCampgrounds) {
        if (err) {
            console.log(err);
        } else {
            res.render("campgrounds/index", {campgrounds: allCampgrounds}); //Source is no longer the array. Now defined by the callback function.
        }
    });
    // res.render("campgrounds.ejs", {campgrounds: campgrounds}); //hard coded array from earlier.
});

//DISPLAY FORM TO COLLECT NEW CAMPGROUND DATA.
app.get("/campgrounds/new", isLoggedIn, function(req, res) {
    res.render("campgrounds/new");
});

//LANDING PAGE
app.get("/", function(req, res) {
    if (req.isAuthenticated()) {
        User.find({}, function(err, registeredUsers) {
            if (err) {
                //console.log("Couldn't find any users: ", err);
            } else {
                console.log("Registered Users: ", registeredUsers);
                res.render("landing", { currentUser: req.user, registeredUsers: registeredUsers });
            }
        });
        //res.render("landing", { currentUser: req.user });
    } else {
        res.render("landing");
    }
});

//NEW -- ADD NEW CAMPGROUND TO THE DATABASE
app.post("/campgrounds", isAdmin, function(req, res) {
    //get data from form
    var name = req.body.name;
    var image = req.body.image;
    var description = req.body.description; //What the name attribute is set to from the EJS file.
    var newCampground = {name: name, image: image, description: description}; //this matches the object format from above.
                        //key: value pair. 
                        //Key: what the name will be wherever it gets sent.
                        //Value: what is being sent. Variable name from above.
    Campground.create(newCampground, function(err, data) {
        if (err) {
            console.log("Problem writing to the Database.");
        } else {
            console.log("Completed writing to the Database: ", data);
        }
    });
    //add campground to array
    //campgrounds.push(newCampground);
    //redirect back to '/campgrounds' page
    res.redirect("/campgrounds"); //The default is to redirect as a GET request.
});

//SHOW PAGE GOES HERE. TAKES ROUTE PARAMETER 'ID'
app.get("/campgrounds/:id", function(req, res) {
    //find the campground with provided ID
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground) {
        if (err) {
            console.log(err) ;
        } else {
            console.log("found campground with id: ", foundCampground);
            res.render("campgrounds/show", {campground: foundCampground, currentUser: req.user}); //under the name campground,
                                                               //Pass in our foundCampground object
        }
    });
    //render Show Template with that campground.
});

// ==============================================================
//                      COMMENTS ROUTES
// ==============================================================

app.get("/campgrounds/:id/comments/new", function(req, res) {
    //Find campground by id
    Campground.findById(req.params.id, function(err, campground) {
        if (err) {
            console.log("Error: ", err);
        } else {
            res.render("comments/new", {campground: campground});
        }
    });
});

//SAVE COMMENT TO CAMPGROUND PAGE.
app.post("/campgrounds/:id/comments", function(req, res) {
    //Lookup campground using ID
    Campground.findById(req.params.id, function(err, campground) {
        if (err) {
            console.log(err);
            res.redirect("/campgrounds");
        } else {
            Comment.create(req.body.comment, function(err, comment) {
                if (err) {
                    console.log(err);
                } else {
                    campground.comments.push(comment);
                    campground.save();
                    res.redirect("/campgrounds/" + campground._id);
                }
            });
        }
    });
    //Create new comments
    
    //Connect new comments to campground
    
    //send back to focus campground and see new comment posted
    //res.redirect("/campgrounds/:id"); 
});

// ==============================================================
//                      AUTH ROUTES
// ==============================================================

app.get("/login", function(req, res) {
    res.render("admin/login");
});

app.get("/logout", function(req, res) {
    req.logout();
    res.redirect("/");
});

//Use this route when you have current Users and want to limit registration to only those already signed up in the DB
// app.get("/register", function(req, res) {
//     res.render("admin/register", {currentUser: req.user});
// });

//use this route when you want to allow anyone to register and sign up.
app.get("/register", function(req, res) {
    res.render("admin/register");
});

app.post("/login", passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/"
}), function(req, res) {
}); //Login & Authenticate User.

//add 'isAdmin' middleware to limit registration to administrators.
app.post("/register", function(req, res) {
    User.register(new User({ username: req.body.username, userlevel: req.body.userlevel }), req.body.password, function(err, user) {
        if (err) {
            //console.log("Error: ", err);
            res.redirect('/register');
        } 
        passport.authenticate("local")(req, res, function() {
            res.redirect("/campgrounds");
        });
    });
});

//DELETE USER
app.post("/removeuser/:id", isAdmin, function(req, res) {
    //Lookup user using ID
    User.findById(req.params.id, function(err, user) {
        if (err) {
            console.log(err);
            res.redirect("/campgrounds");
        } else {
            User.deleteOne(req.body.user, function(err, data) {
                if (err) {
                    console.log(err);
                } else {
                    console.log("User removed.")
                    res.redirect("/");
                }
            });
        }
    }); 
});

//CLOUD 9
//Start Server and listen for requests
// app.listen(process.env.PORT, process.env.IP, function() {
//   console.log("YelpCamp Server Started");  
// });

//LOCALHOST
app.listen(3000, 'localhost', function() {
    console.log("YelpCamp Server Started on localhost");
});