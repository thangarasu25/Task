//for verify this is correct user or not
const jwt = require("jsonwebtoken");
require("dotenv").config();
const userModel = require("../models/userSchema.js");

const authentication = async (req, res, next) => {
  try {
    const token = req.header("x-auth-token");
    if (!token) {
      return res.status(400).json("not an authorized user");
    }
    const verified = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    if (!verified) {
      return res.json("verifyed" + false);
    }
    const user = await userModel.find({ email: verified.email });
    if (!user) {
      return res.json({ messag: "user is not found" });
    }
    req.user = user;
    next();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const adminAuthentication = async (req, res, next) => {
  try {
    const token = req.header("x-auth-token");
    if (!token) {
      return res.status(400).json("not an authorized user");
    }
    const verified = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    if (!verified) {
      return res.json("verifyed" + false);
    }
    const user = await userModel.find({ email: verified.email });
    const role = await userModel.find({ role: verified.role });
    if (!user) {
      return res.json({ messag: "user is not found" });
    }
    if(!role){
      return res.json({ messag: "role is not admin" });
    }
    req.user = user;
    next();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { authentication,adminAuthentication };

