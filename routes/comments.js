var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var Comment = require("../models/comment"); 
var User = require("../models/user");

// ==============================================================
//                      COMMENTS ROUTES
// ==============================================================

router.get("/campgrounds/:id/comments/new", function(req, res) {
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
router.post("/campgrounds/:id/comments", function(req, res) {
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

module.exports = router;