const express = require('express');
const router  = express.Router();

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index', {
    userInSession: req.session.currentUser,
  });
});

router.use((req,res) => {
  res.status(404).render("404");
});

module.exports = router;
