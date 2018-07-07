var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var Comment = require("../models/comment"); 
var User = require("../models/user");

//Comments - New
router.get("/campgrounds/:id/comments/new", function(req, res) {
    //Find campground by id
    Campground.findById(req.params.id, function(err, campground) {
        if (err) {
            console.log("Error: ", err);
        } else {            
            res.render("comments/new", {campground: campground, currentUser: req.user });
        }
    });
});

//EDIT COMMENT
router.get("/comments/:id/editComments", function(req, res) {    
    Comment.findById(req.params.id, function(err, comments) {
        if (err) {
            console.log(err)
            res.redirect("back");
        } else {
            res.render("comments/editComments", { comments: comments, currentUser: req.user });
        }
    });
});

//UPDATE COMMENT
router.post("/comments/:id", function(req, res) {
    Comment.findByIdAndUpdate(req.params.id, req.body.comments, function(err, comment) {
        if (err) {
            console.log("Error updating comment: ", err)
            res.redirect("back");
        } else {
            
            res.redirect("/campgrounds/");
        }
    });
});

//DELETE COMMENT
router.delete("/comments/:id", function(req, res) {
    Comment.findByIdAndRemove(req.params.id, function(err, delComment) {
        console.log("Comment req.params.id: ", req.params.id);
        console.log("req.body.comments: ", req.body.delComments);
        if (err) {
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds");
        }
    })
})

//Comments - Save
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
                    //add username and id to comment
                    //save comment
                    //console.log("New Comment Username will be: ", req.user.username)
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save() //must save the comment so it associates properly.
                    //console.log("comment object from Comment.create callback: ", comment);
                    campground.comments.push(comment);
                    campground.save();
                    res.redirect("/campgrounds/" + campground._id);
                }
            });
        }
    });
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