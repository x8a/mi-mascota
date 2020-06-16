const express = require('express');
const router = express.Router();

router.get("/user-profile", (req, res) => {
  res.render("user/profile", {
    userInSession: req.session.currentUser,
  });
});


module.exports = router;