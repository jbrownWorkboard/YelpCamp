var mongoose = require("mongoose");
var Campground = require("../../models/campground.js");
var Comment = require("../../models/comment.js");
var User = require("../../models/user.js")
   
var UserData = [
    {
        username: "1",
        password: "1",
        userlevel: "Administrator"
    },
    {
        username: "2",
        password: "3",
        userlevel: "Administrator"
    },   
    {
        username: "3",
        password: "3",
        userlevel: "Regular User"
    }    
];
   
var CampgroundData = [
    {
        name: "Cloud's Rest",
        image: "https://thewallpaper.co/wp-content/uploads/2016/01/amazing-views-cool-nature-photos-nature-wallpaper-for-samsung-hd-landscape-wallpapers-plants-sky-free-images-best-nature-images-2048x1298-768x487.jpg",
        description: "Bacon ipsum dolor amet ground round meatball pork bacon. Venison alcatra pork loin, spare ribs jerky pig biltong sirloin chicken drumstick pancetta fatback. Pastrami swine pancetta salami, jowl prosciutto brisket bresaola porchetta sausage leberkas hamburger. Turducken fatback boudin strip steak chicken kevin beef ribs pancetta cow tenderloin bresaola hamburger pork chop."
    },
    {
        name: "Salmon Creek",
        image: "https://thewallpaper.co/wp-content/uploads/2016/01/amazing-views-cool-nature-photos-nature-wallpaper-for-samsung-green-sky-free-images-windows-desktop-images-best-nature-images-1024x730-768x548.jpg",
        description: "Bresaola beef ribs tongue ground round tail kevin leberkas landjaeger t-bone short loin picanha cupim. Pastrami meatball alcatra, doner kielbasa ground round shankle. Leberkas corned beef pork chop shank boudin, burgdoggen prosciutto tongue tail shoulder biltong picanha sirloin ribeye. Corned beef pancetta filet mignon, kevin burgdoggen pork strip steak shankle landjaeger swine pork loin. Chuck picanha kielbasa boudin t-bone cupim, drumstick burgdoggen ground round."
    },
    {
        name: "Some Other Cool Place",
        image: "https://images.unsplash.com/photo-1523497873958-8639c94677f2?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=b14f98986d5a26bbdebf7bcad17d9976&auto=format&fit=crop&w=1355&q=80",
        description: "Rump brisket ribeye bacon tongue meatball turducken beef hamburger. Pastrami flank cow bresaola, ground round ham strip steak turducken jerky beef ribs short ribs shankle. Corned beef landjaeger biltong pork loin venison turducken hamburger meatball jerky frankfurter strip steak pork shank. Picanha beef kevin biltong, jerky meatball burgdoggen strip steak shank sirloin cupim alcatra tail short loin. Venison swine buffalo picanha drumstick, boudin shankle."
    },
];

function seedDB() {
    // User.remove({}, function(err) {
    //     if (err) {
    //         console.log("Error: ", err)
    //     } else {
    //         console.log("Removed Users!")
    //     }
    //     UserData.forEach(function(seed) {
    //         User.create(seed, function(err, data) {
    //             if (err) {
    //                 console.log("Error creating User. ", err)
    //             } else {
    //                 console.log("Inserted User.");
    //             }
    //         })
    //     })
    // })
    
    
    //Remove all campgrounds
    Campground.remove({}, function(err) {
        if (err) {
            console.log("Error: ", err);
        } else {
            console.log("Removed campgrounds!");
            //Add a few campgrounds. Include as part of the callback from above.
            CampgroundData.forEach(function(seed) { //puts data array into DB
                Campground.create(seed, function(err, campground) {
                    if (err) {
                        console.log("Error: ", err);
                    } else {
                        console.log("Added campground!");
                        //Create a comment
                        Comment.create(
                            {
                                text: "This place is great but I wish there was internet!",
                                author: "Josh"
                            }, function(err, comment) {
                                if (err) {
                                    console.log("Error: ", err);
                                } else {
                                    campground.comments.push(comment);
                                    campground.save();
                                    console.log("Created new comment");
                                }
                            }
                        )
                    }
                })
            })
        }
    });
}

module.exports = seedDB;



