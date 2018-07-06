var express = require("express");
var router = express.Router(); 
var Campground = require("../models/campground");
var Comment = require("../models/comment"); 
var User = require("../models/user");

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

// ==============================================================
//              CAMPGROUND USER EXPERIENCE ROUTES
// ==============================================================

//INDEX -- SHOW ALL CAMPGROUNDS
router.get("/campgrounds", function(req, res) {
    //get all campgrounds from DB
    Campground.find({}, function(err, allCampgrounds) {
        if (err) {
            console.log(err);
        } else {
            res.render("campgrounds/index", {campgrounds: allCampgrounds, currentUser: req.user }); //Source is no longer the array. Now defined by the callback function.
        }
    });
    // res.render("campgrounds.ejs", {campgrounds: campgrounds}); //hard coded array from earlier.
});

//DISPLAY FORM TO COLLECT NEW CAMPGROUND DATA.
router.get("/campgrounds/new", isLoggedIn, function(req, res) {
    res.render("campgrounds/new", {currentUser: req.user});
});

//NEW -- ADD NEW CAMPGROUND TO THE DATABASE
router.post("/campgrounds", isAdmin, function(req, res) {
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
router.get("/campgrounds/:id", function(req, res) {
    //find the campground with provided ID
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground) {
        if (err) {
            console.log(err) ;
        } else {
            //console.log("found campground with id: ", foundCampground);
            res.render("campgrounds/show", {campground: foundCampground, currentUser: req.user}); //under the name campground,
                                                               //Pass in our foundCampground object
        }
    });
    //render Show Template with that campground.
});

module.exports = router;