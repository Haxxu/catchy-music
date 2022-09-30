const router = require('express').Router();

const playlistController = require('../app/controllers/PlaylistController');
const userAuth = require('../app/middlewares/userAuth');
const adminAuth = require('../app/middlewares/adminAuth');
const validateObjectId = require('../app/middlewares/validateObjectId');
const artistAuth = require('../app/middlewares/artistAuth');

// [POST] /api/playlists => create new playlist
router.post('/', userAuth, playlistController.createPlaylist);

// [PUT] /api/playlists/:id => update playlist
router.put('/:id', [userAuth, validateObjectId], playlistController.updatePlaylist);

// [POST] /api/playlists/:id/tracks => add track to playlist {track, album} (:id => playlist_id)
router.post('/:id/tracks', [userAuth, validateObjectId], playlistController.addTrackToPlaylist);

// [DELETE] /api/playlists/:id/tracks => remove track from playlist {track, album} (:id => playlist_id)
router.delete('/:id/tracks', [userAuth, validateObjectId], playlistController.removeTrackFromPlaylist);

module.exports = router;
