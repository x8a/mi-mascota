const { Router } = require("express");
const mongoose = require("mongoose");
const router = new Router();
const User = require("../models/User.model");
const Pet = require("../models/Pet.model");
const { db } = require("../models/User.model");

router.get("/user-profile/addPet", (req, res, next) => {
  res.render("user/createPet", { userInSession: req.session.currentUser });
});

router.post("/user-profile/addPet", async (req, res, next) => {
  console.table(req.body);
  const owner = req.session.currentUser._id;
  const { name, animal, breed, birthdate, age } = req.body;
  console.log(animal);
  const myPets = await Pet.find({ owner: owner });
  try {
    const petToInsert = new Pet({
      name,
      owner,
      animal,
      breed,
      birthdate,
      age,
    });
    const pet = await petToInsert.save();
    myPets.push(pet);
    const user = await User.findOneAndUpdate({ _id: owner }, { pets: myPets });
    res.redirect("/user-profile");
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      res.status(500).render("user/createPets", {
        errorMessage: `We couldn't add your pet. Please check that all fields are correct.`,
        userInSession: req.session.currentUser,
      });
    } else {
      next(error);
    }
  }
});

router.get("/pet-profile/:petId", async (req, res, next) => {
  try {
    const pet = await Pet.find({ _id: req.params.petId});
    res.render("pet/petDetails", {pet: pet[0], userInSession: req.session.currentUser});
  } catch (error) {
    next(error);
  }
});

router.post("/delete/pet/:petId", async (req, res, next) => {
try{
  const owner = req.session.currentUser._id;
  const {petId} = req.params;
  const myPets = await Pet.find({owner});
  const filterPets = myPets.filter((currPet) => currPet._id != petId);
  const updateUserPets = await User.findOneAndUpdate({_id: owner}, {pets: filterPets});
  const deletedPet = await Pet.findByIdAndDelete(petId)
  res.redirect("/user-profile");
} catch (error) {
  next(error)
}
})

module.exports = router;
