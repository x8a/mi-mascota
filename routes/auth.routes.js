const { Router } = require("express");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const router = new Router();
const User = require("../models/User.model");
const Pet = require("../models/Pet.model");
const Appointment = require("../models/Appointment.model");

const saltRounds = 10;

router.get("/signup", (req, res) => res.render("auth/signup"));

router.get('/login', (req, res, next) => {
  res.render('auth/login')
});

router.get('/logout', (req, res, next) => {
  req.session.destroy();
  res.redirect('/')
})

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

router.post('/login', async (req, res, next) => {
  const {username,password} = req.body;
  if (!username || !password) {
    res.render('auth/login', {
      errorMessage: 'Please enter both, email and password, to login'
    })
    return;
  }
  try {
    user = await User.findOne({username})
    if(!user) {
      res.render('auth/login', {
        errorMessage: "This user doesn't exist"
      })
    } else if (bcrypt.compareSync(password, user.passwordHash)) {
    req.session.currentUser = user;
    res.redirect('/user-profile')
    } else {
    res.render('auth/login', {
      errorMessage: 'Incorrect Password.'
    });
  }
 } catch (err) {
   next(err)
 } 
})

module.exports = router;