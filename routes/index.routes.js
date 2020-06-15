const express = require('express');
const router  = express.Router();

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});

router.get("/user-profile", (req, res) => {
  res.render("user/profile", {
    userInSession: req.session.currentUser,
  });
});

module.exports = router;
