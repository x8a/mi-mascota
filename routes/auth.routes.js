const { Router } = require("express");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const router = new Router();
const User = require("../models/User.model");
const Pet = require("../models/Pet.model");
const Appointment = require("../models/Appointment.model");
const uploadProfilePic = require('../configs/cloudinaryUser');
const passport = require("passport");

const saltRounds = 10;

router.get("/signup", (req, res) => res.render("auth/signup"));

router.get('/login', (req, res, next) => {
  res.render('auth/login')
});

router.post('/login', async (req, res, next) => {
  const {
    username,
    password
  } = req.body;
  if (!username || !password) {
    res.render('auth/login', {
      errorMessage: 'Introduce email y contraseña para iniciar sesión.'
    })
    return;
  }
  try {
    user = await User.findOne({
      username
    })
    if (!user) {
      res.render('auth/login', {
        errorMessage: "Este usuario no existe."
      })
    } else if (bcrypt.compareSync(password, user.passwordHash)) {
      req.session.currentUser = user;
      res.redirect('/user-profile')
    } else {
      res.render('auth/login', {
        errorMessage: 'Contraseña incorrecta.'
      });
    }
  } catch (err) {
    next(err)
  }
})

router.get('/auth/google', passport.authenticate('google', {
  scope: ["https://www.googleapis.com/auth/userinfo.profile", "https://www.googleapis.com/auth/userinfo.email"]
}));

router.get("/auth/google/callback", 
passport.authenticate("google", {failureRedirect: "/login"}), 
  (req, res) => {
    req.session.currentUser = req.user;
    res.redirect('/')
  }
);


router.get('/logout', (req, res, next) => {
  req.session.destroy();
  res.redirect('/')
})

router.post("/signup", uploadProfilePic.single('profilePic'), (req, res, next) => {
  const {
    firstName,
    lastName,
    username,
    email,
    password
  } = req.body;

  if (!firstName || !lastName || !username || !email || !password) {
    res.render("auth/signup", {
      errorMessage: "Los siguientes campos son obligatorios: nombre, apellido, Email, usuario, y contraseña.",
    });
    return;
  }

  const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
  if (!regex.test(password)) {
    res.status(500).render("auth/signup", {
      errorMessage:
      "La contraseña debe tener 6 caracteres, e inlcuir un número, una letra minúscula y una letra mayúscula.",
    });

    return;
  }

  bcrypt
    .genSalt(saltRounds)
    .then(salt => bcrypt.hash(password, salt))
    .then(hashedPassword => {
      // Create the user in the db
      return User.create({
        profilePic: req.file ? req.file.path : undefined,
        firstName: firstName,
        lastName: lastName,
        username: username,
        email: email,
        passwordHash: hashedPassword,
      }); 
    })
    .then(user => {
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
          errorMessage: "El usuario o el email ya están registrados.",
        });
      } else {
        next(error);
      }
    });
});



module.exports = router;