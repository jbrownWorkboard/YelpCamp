var express         = require("express");
var passport        = require("passport");
var User            = require("../models/user");
var middleware      = require("../middleware/")
var router          = express.Router();

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
                //console.log("Registered Users: ", registeredUsers);
                res.render("landing", { currentUser: req.user, registeredUsers: registeredUsers });
            }
        });
        //res.render("landing", { currentUser: req.user });
    } else {
        res.render("landing", { success: req.flash("Welcome") });
    }
});

router.get("/admin", middleware.isAdmin, function(req, res) {
    if (req.isAuthenticated()) {
        User.find({}, function(err, registeredUsers) {
            if (err) {
                //console.log("Couldn't find any users: ", err);
            } else {
                //console.log("Registered Users: ", registeredUsers);
                res.render("admin/admin", { currentUser: req.user, registeredUsers: registeredUsers });
            }
        });
    } else {
        res.render("landing");
    }
})

//Login
router.get("/login", function(req, res) {
    res.render("admin/login");
    req.flash("error", "Please log in.");
});

//Logout
router.get("/logout", function(req, res) {
    req.logout();
    req.flash("success", "Logged out.");
    res.redirect("/campgrounds");
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
    successRedirect: "/campgrounds",
    failureRedirect: "/login"
}), function(req, res) {
}); //Login & Authenticate User.

//add 'isAdmin' middleware to limit registration to administrators.
router.post("/register", function(req, res) {
    User.register(new User({ username: req.body.username, userlevel: req.body.userlevel }), req.body.password, function(err, user) {
        if (err) {
            req.flash("error", err.message);
            res.redirect('/register');
        }
        passport.authenticate("local")(req, res, function() {
            req.flash("success", "Welcome to YelpCamp, " + user.username + "!");
            res.redirect("/campgrounds");
        });
    });
});

//DELETE USER
router.post("/removeuser/:id", middleware.isAdmin, function(req, res) {
    //Lookup user using ID
    User.findById(req.params.id, function(err, user) {
        if (err) {
            console.log(err);
            res.redirect("/campgrounds");
        } else {
            User.findByIdAndRemove(req.params.id, function(err, data) {
                if (err) {
                    console.log(err);
                } else {
                    console.log("User removed.")
                    res.redirect("/admin");
                }
            });
        }
    });
});

module.exports = router;