const express = require("express");
const router = express.Router();
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

router.get("/edit/user-profile/:userId", async (req, res, next) => {
  try{
    res.render("user/editProfile", {userInSession: req.session.currentUser});
  } catch (e) {
    next(e);
  }
})

router.post("/edit/user-profile/:userId", async (req, res, next) => {
  try{
    const updatedUser = await User.findByIdAndUpdate(req.body._id, req.body);
    res.redirect("/user-profile");
  } catch (e) {
    next(e);
  }
})

module.exports = router;
