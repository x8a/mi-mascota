const express = require("express");
const router = express.Router();
const Pet = require("../models/Pet.model");

router.get("/user-profile", async (req, res, next) => {
  try {
    const myPets = await Pet.find({ owner: req.session.currentUser._id });
    res.render("user/profile", {
      userInSession: req.session.currentUser,
      myPets: myPets,
    });
  } catch (e) {
    next(e);
  }
});

module.exports = router;
