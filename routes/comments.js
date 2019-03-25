var express             = require("express");
var Campground          = require("../models/campground");
var Comment             = require("../models/comment"); 
var User                = require("../models/user");
var middleware          = require("../middleware");
var router              = express.Router({mergeParams: true});

//Comments - New
router.get("/campgrounds/:id/comments/new", middleware.isLoggedIn, function(req, res) {
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
router.get("/comments/:id/editComments", middleware.isLoggedIn, function(req, res) {
    var campgroundIdURL = req.headers.referer;
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
router.post("/comments/:id", middleware.checkCommentOwnership, function(req, res) {
    Comment.findByIdAndUpdate(req.params.id, req.body.comments, function(err, comment) {
        if (err) {
            console.log("Error updating comment: ", err)
            res.redirect("back");
        } else {
            req.flash("success", "Successfully added comment. Thanks!");
            res.redirect("/campgrounds/");
        }
    });
});

//DELETE COMMENT
router.delete("/comments/:id", middleware.checkCommentOwnership, function(req, res) {
    Comment.findByIdAndRemove(req.params.id, function(err, delComment) {
        if (err) {
            res.redirect("/campgrounds");
        } else {
            req.flash("error", "We didn't like that comment either. Thanks for blasting it.");
            res.redirect("back");
        }
    })
})

//Comments - Save
router.post("/campgrounds/:id/comments", middleware.isLoggedIn, function(req, res) {
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

module.exports = router;