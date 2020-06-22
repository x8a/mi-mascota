const { Router } = require("express");
const mongoose = require("mongoose");
const router = new Router();
const User = require("../models/User.model");
const Pet = require("../models/Pet.model");
const { db } = require("../models/User.model");
const uploadPetPic = require('../configs/cloudinaryPet')

router.get("/addPet", (req, res, next) => {
  res.render("user/createPet", { userInSession: req.session.currentUser });
});


router.post("/addPet", uploadPetPic.single('pic'), async (req, res, next) => {
  const owner = req.session.currentUser._id;
  const { name, animal, breed, birthdate, age } = req.body;
  const pic = req.file.path;
  console.log(animal);
  const myPets = await Pet.find({ owner: owner });
  try {
    const petToInsert = new Pet({
      pic,
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
    res.redirect("/pets");
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      res.status(500).render("user/createPets", {
        errorMessage: `No se añadió la mascota. Asegúrate de que todos los campos están correctos.`,
        userInSession: req.session.currentUser,
      });
    } else {
      next(error);
    }
  }
});

router.get("/edit/pet-profile/:petId", async (req, res, next) => {
  try {
    const pet = await Pet.find({_id: req.params.petId});
    res.render("pet/petDetails", {
      pet: pet[0],
      userInSession: req.session.currentUser
    });
  } catch (error) {
    next(error);
  }
});

router.post("/edit/pet-profile/:petId", async (req, res, next) => {
  try {
    //const pet = await Pet.find({_id: req.params.petId});
    const updatedPet = await Pet.findByIdAndUpdate(req.params.petId, req.body, {new: true});
    res.redirect("/pets");
  } catch (error) {
    next(error);
  }
})

router.post("/delete/pet/:petId", async (req, res, next) => {
try{
  const owner = req.session.currentUser._id;
  const {petId} = req.params;
  const myPets = await Pet.find({owner});
  const filterPets = myPets.filter((currPet) => currPet._id != petId);
  const updateUserPets = await User.findOneAndUpdate({_id: owner}, {pets: filterPets});
  const deletedPet = await Pet.findByIdAndDelete(petId)
  res.redirect("/pets");
} catch (error) {
  next(error)
}
})

router.get("/pets", async (req, res,next) => {
  try {
    const myPets = await Pet.find({
      owner: req.session.currentUser._id
    });
    res.render("pet/allPets", {
      userInSession: req.session.currentUser,
      myPets: myPets
    });
  } catch (e) {
    next(e);
  }
})

module.exports = router;
