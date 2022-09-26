const router = require('express').Router();

const meController = require('../app/controllers/MeController');
const userAuth = require('../app/middlewares/userAuth');
const adminAuth = require('../app/middlewares/adminAuth');
const validateObjectId = require('../app/middlewares/validateObjectId');

// [GET] /api/me => get current user profile
router.get('/', userAuth, meController.getCurrentUserProfile);

module.exports = router;
