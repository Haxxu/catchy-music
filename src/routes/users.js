const router = require('express').Router();

const userController = require('../app/controllers/UserController');
const userAuth = require('../app/middlewares/userAuth');
const adminAuth = require('../app/middlewares/adminAuth');

// [GET] Get All User
router.get('/', userAuth, userController.getAllUsers);

// [POST] /api/users => create user
router.post('/', userController.createUser);

module.exports = router;
