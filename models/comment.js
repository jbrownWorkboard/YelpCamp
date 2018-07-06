var mongoose = require("mongoose"); 
var passportLocalMongoose = require("passport-local-mongoose");

var commentSchema = new mongoose.Schema({
    text: String,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User" //refers to the model being referenced 
        },
        username: String,
    }
});

//This sends the model out when required
module.exports = mongoose.model("Comment", commentSchema);