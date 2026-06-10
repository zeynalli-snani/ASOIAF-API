const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const router = express.Router();
const authController = require('../controllers/authController');


router.post('/register', authController.register);
router.post('/login', authController.login);


router.get('/google', passport.authenticate('google', { 
  scope: ['profile', 'email'], 
  session: false 
}));

router.get('/google/callback', 
  passport.authenticate('google', { session: false, failureRedirect: '/api-docs' }),
  (req, res) => {
    
    const token = jwt.sign(
      { userId: req.user.id, username: req.user.username },
      process.env.JWT_SECRET,
      { expiresIn: '2h' }
    );

    res.status(200).send(`
      <html>
        <body style="font-family: sans-serif; padding: 2rem;">
          <h2>Authentication Successful</h2>
          <p>Welcome, <b>${req.user.username}</b>!</p>
          <p>Here is your Bearer token. Copy it to use in Postman or Swagger:</p>
          <textarea readonly rows="6" cols="80" style="padding: 10px;">${token}</textarea>
        </body>
      </html>
    `);
  }
);

module.exports = router;