const router = require('express').Router();

const userController = require('../app/controllers/UserController');

const userAuth = require('../app/middlewares/userAuth');
const adminAuth = require('../app/middlewares/adminAuth');
const validateObjectId = require('../app/middlewares/validateObjectId');

// [GET] Get All User
router.get('/', userAuth, userController.getAllUsers);

// [POST] /api/users => create user
router.post('/', userController.createUser);

// [POST] /api/users/verify-artist/:id (user_id)
router.post('/verify-artist/:id', [adminAuth, validateObjectId], userController.verifyArtist);

// [POST] /api/users/unverify-artist/:id (user_d)
router.post('/unverify-artist/:id', [adminAuth, validateObjectId], userController.unverifyArtist);

module.exports = router;
