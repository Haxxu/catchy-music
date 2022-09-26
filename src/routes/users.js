const router = require('express').Router();

const userController = require('../app/controllers/UserController');
const userAuth = require('../app/middlewares/userAuth');
const adminAuth = require('../app/middlewares/adminAuth');
const validateObjectId = require('../app/middlewares/validateObjectId');

// [POST] /api/users => create user
router.post('/', userController.createUser);

// [POST] /api/users/verify-artist/:id (user_id) => verify artist
router.post('/verify-artist/:id', [adminAuth, validateObjectId], userController.verifyArtist);

// [POST] /api/users/unverify-artist/:id (user_d) => unverify artist
router.post('/unverify-artist/:id', [adminAuth, validateObjectId], userController.unverifyArtist);

// [POST] /api/users/update-password => change password
router.post('/update-password', userController.updatePassword);

// [PATCH] /api/users/freeze/:id => freeze user by id
router.patch('/freeze/:id', [adminAuth, validateObjectId], userController.freezeUser);

// [PATCH] /api/users/unfreeze/:id => unfreeze user by id
router.patch('/unfreeze/:id', [adminAuth, validateObjectId], userController.unfreezeUser);

// [GET] /api/users/q => get users by context
router.get('/q', adminAuth, userController.getUsersByContext);

// [GET] /api/users/:id => get user by id
router.get('/:id', [userAuth, validateObjectId], userController.getUser);

// [PUT] /api/users/:id => update user by id
router.put('/:id', [userAuth, validateObjectId], userController.updateUser);

// [DELETE] /api/users/freeze/:id => breeze user by id
// router.delete('/:id', [adminAuth, validateObjectId], userController.removeUser);

module.exports = router;
