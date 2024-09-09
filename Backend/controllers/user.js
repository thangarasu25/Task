const userModel = require("../models/userSchema");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const multer = require("multer");
var fs = require('fs');
require("dotenv").config();





const getAllUser = async (req, res) => {
  try {
    const allUser = await userModel.find({});
    res.status(200).send(allUser);
  } catch (error) {
    console.log(error);
    res.status(500).send({ err: "read user " + error });
  }
};










const register = async (req, res) => {

  const { user, email, password, role, tradename, mobileNo } = req.body;
  try {
    const exist = await userModel.find({ email: email });
    if (exist.length) {
      return res.json({ message: "you are already an user" });
    }
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new userModel({
      user, email, password: hashedPassword, role, tradename, mobileNo, 
    });
    await newUser.save();
    res.status(201).send("User created successfully");
  } catch (error) {
    res.status(400).send("register" + error);
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const userData = await userModel.findOne({ email: email });
    if (!userData) {
      return res
        .status(400)
        .json({ status: 400, massage: "user is not found" });
    }
    if (await bcrypt.compare(password, userData.password)) {
      const token = jwt.sign(
        { id: userData._id, user: userData.user, email: userData.email },
        process.env.ACCESS_TOKEN_SECRET
      );
      const { user, email, password, role, mobileNo } = userData;
      let obj = { status: true, data: [{ user, email, role,mobileNo,  tokenId: token }] };

     return res.json(obj);
    } else {
      return res.status(400).send("not an user");
    }
  } catch (error) {
    res.status(400).send(error);
  }
};

const deleteUser = async (req, res) => {
  try {
    const deletedUser = await userModel.findByIdAndDelete(req.params.id);
    res.status(200).json(deletedUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const userTokenvalid = async (req, res) => {
  try {
    const token = req.header("x-auth-token");
    if (!token) {
      return res.json("token not found" + false);
    }
    const verified = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    if (!verified) {
      return res.json("not varified user " + false);
    }
    const user = await userModel.find({ email: verified.email });
    // console.log("user" + user);
    if (!user) {
      return res.json("user is not found" + false);
    }
    return res.json(true);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


const otpVerify = async (req, res) => {
  try {
    const otp = req.body.otp;
    res.status(200).json({ otp });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = {
  getAllUser,
  register,
  login,
  deleteUser,
  userTokenvalid,

};
