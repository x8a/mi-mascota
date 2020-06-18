const express = require("express");
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require("../models/User.model");
const Pet = require("../models/Pet.model");

router.get("/user-profile", async (req, res, next) => {
  try {
    const myPets = await Pet.find({ owner: req.session.currentUser._id });
    res.render("user/profile", {
      userInSession: req.session.currentUser,
      myPets: myPets
    });
  } catch (e) {
    next(e);
  }
});

router.get("/edit/user-profile/:userId", (req, res, next) => {
  try{
    res.render("user/editProfile", {userInSession: req.session.currentUser});
  } catch (e) {
    next(e);
  }
})

router.post("/edit/user-profile/:userId", async (req, res, next) => {
  try{
    const {password, newPassword} = req.body;
    const saltRounds = 10; // Cost of generating the hash
    const salt = bcrypt.genSaltSync(saltRounds); // Key to generate the hash

    const passHash = bcrypt.hashSync(password, salt); // Generate the hash with a password and the salt
    const newPassHash = bcrypt.hashSync(newPassword, salt); // Generate the hash with a password and the salt
    const verifyPass = bcrypt.compareSync(passHash, newPassHash); // Compare the two passwords

    if(password && newPassword && verifyPass) {
      const updatedUser = await User.findByIdAndUpdate(req.body._id, {passHash: passHash});
      res.redirect("/user-profile");
    } else if (password && newPassword && !verifyPass) {
      res.render("user/editProfile", {errorMessage: "The passwords do not match."});
    } else {
      const updatedUser = await User.findByIdAndUpdate(req.body._id, req.body);
      res.redirect("/user-profile");
    }
  
  } catch (e) {
    next(e);
  }
})

module.exports = router;
