const {Router} = require("express");
const mongoose = require("mongoose");
const router = new Router();
const User = require("../models/User.model");
const Pet = require("../models/Pet.model");


router.get('/user-profile/addPet', (req, res, next) => {
  res.render('user/createPet', {userInSession: req.session.currentUser});
})

router.post('/user-profile/addPet', async (req, res, next) => {
  console.table(req.body)
  const owner = req.session.currentUser._id;
  const {name, animal, breed, birthdate, age} = req.body;
  console.log(animal)
  try {
    const petToInsert = new Pet({
      name,
      owner,
      animal,
      breed,
      birthdate,
      age
    })
    const pet = await petToInsert.save()
    res.redirect('/user-profile');
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError){
      res.status(500).render('user/createPets', {
        errorMessage: `We couldn't add your pet. Please check that all fields are correct.`,
        userInSession: req.session.currentUser,
      })
    } else {
      next(error)
    }
  }
})

module.exports = router