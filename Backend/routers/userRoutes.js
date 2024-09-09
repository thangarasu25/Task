const express = require("express");
const router = express.Router();
const { authentication,adminAuthentication } = require("../middleware/auth");
const multer = require("multer");
const userController = require("../controllers/user");

router.get("/allgetalluser",authentication, userController.getAllUser);

router.post("/register", userController.register);

router.post("/login", userController.login);

router.delete("/delete/:id", authentication, userController.deleteUser);

// router.post("/tokenIsValid", userController.userTokenvalid);
// router.post("/generateotp", userController.otpGenerate);
// router.post("/verify", userController.otpVerify);


module.exports = router;
