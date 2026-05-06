const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { protect } = require('../middleware/auth.middleware');

//hi it needs authentication :
router.use(protect);

router.get('/profile', userController.getUserProfile);
router.put('/profile', userController.updateUserProfile);
router.put('/change-password', userController.updatePassword);
router.delete('/account', userController.deleteUserAccount);

module.exports = router;