const express = require('express');
const router = express.Router();
const characterController = require('../controllers/characterController');
const auth = require('../middleware/auth'); // Import the JWT gatekeeper

router.get('/', characterController.getAllCharacters);
router.get('/:id', characterController.getCharacterById);

router.post('/', auth, characterController.createCharacter);
router.put('/:id', auth, characterController.updateCharacter);
router.delete('/:id', auth, characterController.destroyCharacter);

module.exports = router;