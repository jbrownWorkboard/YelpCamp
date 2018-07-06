var express = require("express");
var router = express.Router();
var passport = require("passport");
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

//Root Route
router.get("/", function(req, res) {
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

//Login
router.get("/login", function(req, res) {
    res.render("admin/login");
});

//Logout
router.get("/logout", function(req, res) {
    req.logout();
    res.redirect("/");
});

//Use this route when you have current Users and want to limit registration to only those already signed up in the DB
// app.get("/register", function(req, res) {
//     res.render("admin/register", {currentUser: req.user});
// });

//use this route when you want to allow anyone to register and sign up.
router.get("/register", function(req, res) {
    res.render("admin/register");
});

router.post("/login", passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/"
}), function(req, res) {
}); //Login & Authenticate User.

//add 'isAdmin' middleware to limit registration to administrators.
router.post("/register", function(req, res) {
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
router.post("/removeuser/:id", isAdmin, function(req, res) {
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

module.exports = router;