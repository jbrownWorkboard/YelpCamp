var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var UserSchema = new mongoose.Schema({
    username: String,
    password: String,
    userlevel: String
});

UserSchema.plugin(passportLocalMongoose);

//This sends the model out when required
module.exports = mongoose.model("User", UserSchema);