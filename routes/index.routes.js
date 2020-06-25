const express = require('express');
const router  = express.Router();

/* GET home page */
router.get('/', (req, res, next) => {
  req.session.currentUser ? res.redirect('/user-profile') : res.render('index', {userInSession: req.session.currentUser});
});


module.exports = router;
