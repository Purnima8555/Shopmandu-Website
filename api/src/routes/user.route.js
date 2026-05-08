const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { protect } = require('../middleware/auth.middleware');


// Public need not be authenticated
router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);
router.post('/forgot-password', userController.forgotPassword);
router.put('/reset-password/:resetToken', userController.resetPassword);

// Middleware to protect routes below
router.use(protect);

// Protected routes
router.get('/profile', userController.getUserProfile);
router.get('/all', userController.getAllUsers); 

module.exports = router;