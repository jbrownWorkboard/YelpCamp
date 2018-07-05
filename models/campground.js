var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var campgroundSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String,
    comments: [
                {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Comment"
                }
            ]
});

module.exports = mongoose.model("Campground", campgroundSchema);

//Populate the database with initial information. Move this around as needed.
// Campground.create(
//     {
        
//         name: "Salmon Creek2",
//         image: "https://media.istockphoto.com/photos/mystical-night-landscape-in-the-foreground-hike-campfire-and-tent-picture-id522780377" ,
//         description: "Awesome Salmon Creek Location #2"
        
//     },
//     function(err, campground) { //remember the callback parameters are what comes back to us from the DB
//         if (err) {
//             console.log("Error: ", err)
//         } else {
//             console.log("Created and Saved " + campground + " To the Database.");
//             console.log(campground);
//         }
//     })

// var campgrounds = [
//     {name: "Salmon Creek", image: "https://thumb7.shutterstock.com/display_pic_with_logo/161429734/745284697/stock-photo-lake-of-two-rivers-campground-algonquin-national-park-beautiful-natural-forest-landscape-canada-745284697.jpg" },
//     {name: "Salmon Creek2", image: "https://media.istockphoto.com/photos/mystical-night-landscape-in-the-foreground-hike-campfire-and-tent-picture-id522780377" },
//     {name: "Salmon Creek3", image: "https://images.unsplash.com/photo-1525209149972-1d3faa797c3c?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=053f91dd9aee1cc7bc5cafca28cb625c&auto=format&fit=crop&w=500&q=60"},
//     {name: "Salmon Creek4", image: "https://images.unsplash.com/photo-1523497873958-8639c94677f2?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=b14f98986d5a26bbdebf7bcad17d9976&auto=format&fit=crop&w=1355&q=80" },
//     {name: "Salmon Creek5", image: "https://images.unsplash.com/photo-1476041800959-2f6bb412c8ce?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=c85daa025ee04c951b6ac12fe3ba031a&auto=format&fit=crop&w=500&q=60" },
//     {name: "Salmon Creek", image: "https://thumb7.shutterstock.com/display_pic_with_logo/161429734/745284697/stock-photo-lake-of-two-rivers-campground-algonquin-national-park-beautiful-natural-forest-landscape-canada-745284697.jpg" },
//     {name: "Salmon Creek2", image: "https://media.istockphoto.com/photos/mystical-night-landscape-in-the-foreground-hike-campfire-and-tent-picture-id522780377" },
//     {name: "Salmon Creek3", image: "https://images.unsplash.com/photo-1525209149972-1d3faa797c3c?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=053f91dd9aee1cc7bc5cafca28cb625c&auto=format&fit=crop&w=500&q=60"},
//     {name: "Salmon Creek4", image: "https://images.unsplash.com/photo-1523497873958-8639c94677f2?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=b14f98986d5a26bbdebf7bcad17d9976&auto=format&fit=crop&w=1355&q=80" },
//     {name: "Salmon Creek5", image: "https://images.unsplash.com/photo-1476041800959-2f6bb412c8ce?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=c85daa025ee04c951b6ac12fe3ba031a&auto=format&fit=crop&w=500&q=60" }
// ];

