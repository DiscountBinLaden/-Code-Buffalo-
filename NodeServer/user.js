const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    userID: String,
    passwd: String,
    avgPrice: Number,
    priceN: Number,
    favorites: String
});

module.exports = mongoose.model("User", userSchema);
