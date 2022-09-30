const router = require('express').Router();

const albumController = require('../app/controllers/AlbumController');
const userAuth = require('../app/middlewares/userAuth');
const adminAuth = require('../app/middlewares/adminAuth');
const validateObjectId = require('../app/middlewares/validateObjectId');
const artistAuth = require('../app/middlewares/artistAuth');

// [POST] /api/albums => create new album
router.post('/', artistAuth, albumController.createAlbum);

// [GET] /api/albums/:id => get ablum by id
router.get('/:id', albumController.getAlbumById);

// [PUT] /api/albums/:id => update ablum by id
router.put('/:id', [artistAuth, validateObjectId], albumController.updateAlbum);

// [PUT] /api/albums/:id/release[?is_released=false] => toggle release date of album
router.put('/:id/release', [artistAuth, validateObjectId], albumController.toggleReleaseAlbum);

module.exports = router;
