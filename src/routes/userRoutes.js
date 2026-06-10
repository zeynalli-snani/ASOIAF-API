const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/auth'); 

router.get('/me', auth, userController.getMe);
router.delete('/account', auth, userController.deleteAccount);

module.exports = router;