const router = require('express').Router();

const meController = require('../app/controllers/MeController');
const userAuth = require('../app/middlewares/userAuth');
const adminAuth = require('../app/middlewares/adminAuth');
const validateObjectId = require('../app/middlewares/validateObjectId');

// [GET] /api/me => get current user profile
router.get('/', userAuth, meController.getCurrentUserProfile);

// [GET] /api/me/following => get following user
router.get('/following', userAuth, meController.getFollowing);

// [PUT] /api/me/following => follow user or artist
router.put('/following', userAuth, meController.followUser);

// [DELETE] /api/me/following => unfollow user or artist
router.delete('/following', userAuth, meController.unfollowUser);

// [GET] /api/me/albums => get saved albums
router.get('/albums', userAuth, meController.getSavedAlbums);

// [PUT] /api/me/albums => save album to library
router.put('/albums', userAuth, meController.saveAblum);

// [DELETE] /api/me/albums => remove saved album from library
router.delete('/albums', userAuth, meController.removeSavedAlbum);

module.exports = router;
