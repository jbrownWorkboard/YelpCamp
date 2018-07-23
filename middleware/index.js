var Campground          = require("../models/campground");
var Comment             = require("../models/comment"); 

//all the middleware goes here
var middlewareObj = {};

middlewareObj.isLoggedIn = function (req, res, next) {
    var auth = req.isAuthenticated();
    if (auth == true) {
        return next();
    }
    req.flash("error", "Please Login.");
    res.redirect("/");
};

middlewareObj.isAdmin = function(req, res, next) {
    if (typeof(req.user) != 'undefined' && req.user.userlevel == "Administrator") {
        return next();
    }
    req.flash("error", "You must be an administrator to do that.");
    res.redirect("/");
}

middlewareObj.checkCommentOwnership = function(req, res, next) {
    var auth = req.isAuthenticated();
    if (auth == true) {
        Comment.findById(req.params.id, function(err, foundComment) {
            if (err) {
                res.redirect("back");
            } else {
                if (foundComment.author.id.equals(req.user._id) || req.user.userlevel == "Administrator") {
                    next();
                    } else {
                        req.flash("error", "You don't have permission for this!");
                        res.redirect("back");
                    }
                }
            })
        }
    }

module.exports = middlewareObj;
