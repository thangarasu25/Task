const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
  user: { type: String, required: true },
  password: { type: String, required: true, minlength: 5 },
  role: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  mobileNo: { type: String, required: true }
 
}
);
module.exports = mongoose.model("user", userSchema);


