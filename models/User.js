const mongoose = require("mongoose");

let userSchema = mongoose.Schema({
  username: { type: String, unique: true },
  password: { type: String },
  email: { type: String }
});

let User = mongoose.model("users", userSchema);

module.exports = User;
