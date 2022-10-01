const router = require('express').Router();

const trackController = require('../app/controllers/TrackController');
const userAuth = require('../app/middlewares/userAuth');
const adminAuth = require('../app/middlewares/adminAuth');
const validateObjectId = require('../app/middlewares/validateObjectId');
const artistAuth = require('../app/middlewares/artistAuth');

// [POST] /api/tracks => create new track
router.post('/', artistAuth, trackController.createTrack);

// [GET] /api/tracks/:id => get track by id
router.get('/:id', [userAuth, validateObjectId], trackController.getTrack);

// [PUT] /api/tracks/:id => update track by id
router.put('/:id', [artistAuth, validateObjectId], trackController.updateTrack);

// [DELETE] /api/tracks/:id => remove track by id
router.delete('/:id', [artistAuth, validateObjectId], trackController.deleteTrack);

module.exports = router;
