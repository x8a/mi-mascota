const { Router } = require("express");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const router = new Router();
const User = require("../models/User.model");
const Pet = require("../models/Pet.model");
const Appointment = require("../models/Appointment.model");

const saltRounds = 10;

router.get("/signup", (req, res) => res.render("auth/signup"));

router.get("/user-profile", (req, res) => {
  res.render("user/profile", {
    userInSession: req.session.currentUser,
  });
});

router.post("/signup", (req, res, next) => {
  const { firstName, lastName, username, email, password } = req.body;

  if (!firstName || !lastName || !username || !email || !password) {
    res.render("auth/signup", {
      errorMessage: "Name, Last name, Email, username, and password are mandatory.",
    });
    return;
  }

  const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
  if (!regex.test(password)) {
    res.status(500).render("auth/signup", {
      errorMessage:
        "The password must contain at least 6 characters, and include one number, one lowercase and one uppercase letter.",
    });

    return;
  }

  bcrypt
    .genSalt(saltRounds)
    .then(salt => bcrypt.hash(password, salt))
    .then(hashedPassword => {
      // Create the user in the db
      return User.create({
        firstName: firstName,
        lastName: lastName,
        username: username,
        email: email,
        passwordHash: hashedPassword,
      }); 
    })
    .then(user => {
      console.log(`User created: ${user}`);
      req.session.currentUser = user;
      res.redirect("/user-profile");
    })
    .catch((error) => {
      if (error instanceof mongoose.Error.ValidationError) {
        res.status(400).render("auth/signup", {
          errorMessage: error.message,
        });
      } else if (error.code === 11000) {
        res.status(500).render("auth/signup", {
          errorMessage: "Username or email already exist.",
        });
      } else {
        next(error);
      }
    });
});

module.exports = router;