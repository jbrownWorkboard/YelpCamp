var express         = require("express");
var middleware      = require("../middleware");
var Campground      = require("../models/campground");
var Comment         = require("../models/comment"); 
var User            = require("../models/user");
var router          = express.Router({mergeParams: true});

// ==============================================================
//              CAMPGROUND USER EXPERIENCE ROUTES
// ==============================================================

//INDEX -- SHOW ALL CAMPGROUNDS
router.get("/campgrounds", function(req, res) {
    if (req.query.search) {
        regex = new RegExp(escapeRegex(req.query.search), 'gi');
    //get all campgrounds from DB
        Campground.find({name: regex}, function(err, allCampgrounds) {
            if (err) {
                console.log(err);
            } else {
                console.log("search result: ", allCampgrounds)
                res.render("campgrounds/index", {campgrounds: allCampgrounds, currentUser: req.user }); //Source is no longer the array. Now defined by the callback function.
            }
    });
    } else {
        Campground.find({}, function(err, allCampgrounds) {
            if (err) {
                console.log(err);
            } else {
                console.log("search result: ", allCampgrounds)
                res.render("campgrounds/index", {campgrounds: allCampgrounds, currentUser: req.user }); //Source is no longer the array. Now defined by the callback function.
            }
        });
    }
});

//DISPLAY FORM TO COLLECT NEW CAMPGROUND DATA.
router.get("/campgrounds/new", middleware.isLoggedIn, function(req, res) {
    res.render("campgrounds/new", {currentUser: req.user});
});

//NEW -- ADD NEW CAMPGROUND TO THE DATABASE
router.post("/campgrounds", middleware.isLoggedIn, function(req, res) {
    //get data from form
    var name = req.body.name;
    var price = req.body.price;
    var image = req.body.image;    
    var description = req.body.description; //What the name attribute is set to from the EJS file.
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newCampground = {name: name, price: price, image: image, description: description, author: author}; //this matches the object format from above.
                        //key: value pair. 
                        //Key: what the name will be wherever it gets sent.
                        //Value: what is being sent. Variable name from above.
    //console.log("req.user", req.user)
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

//EDIT CAMPGROUND ROUTE
router.get("/campgrounds/:id/edit", middleware.checkCampgroundOwnership, function(req, res) {
    Campground.findById(req.params.id, function(err, foundCampground) {
        if (err) {
            console.log("Ran into error getting the edit page: ", err);
        } else {
            res.render("campgrounds/editCampground", {campground: foundCampground});
        }
    });
});

//UPDATE CAMPGROUND ROUTE
router.post("/campgrounds/:id", middleware.checkCampgroundOwnership, function(req, res) {
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updateCampground) {
        if (err) {
            console.log("Couldn't update campground. Error: ", err)
        } else {
            console.log("Campground successfully updated.". updateCampground);
            res.redirect("/campgrounds/" + req.params.id );
        }
    })
})

//DESTROY CAMPGROUND ROUTE
router.delete("/campground/:id", middleware.checkCampgroundOwnership, function(req, res) {
    Campground.findByIdAndRemove(req.params.id, function(err, delCampground) {
        if (err) {
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds");
        }
    })
})

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}


module.exports = router;