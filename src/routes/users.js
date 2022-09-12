const router = require('express').Router();

const userController = require('../app/controllers/UserController');

// Get All User
router.get('/', userController.getAllUsers);

module.exports = router;
