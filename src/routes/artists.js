const router = require('express').Router();

const artistController = require('../app/controllers/ArtistController');
const userAuth = require('../app/middlewares/userAuth');
const adminAuth = require('../app/middlewares/adminAuth');
const validateObjectId = require('../app/middlewares/validateObjectId');
const artistAuth = require('../app/middlewares/artistAuth');

// [GET] /api/artists => get artist by id
router.get('/:id', [userAuth, validateObjectId], artistController.getArtistById);

module.exports = router;
