const router = require('express').Router();

const meController = require('../app/controllers/MeController');
const audioPlayerController = require('../app/controllers/AudioPlayerController');
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

// [GET] /api/me/playlists => get saved playlists
router.get('/playlists', userAuth, meController.getSavedPlaylists);

// [PUT] /api/me/playlists => save playlist to library
router.put('/playlists', userAuth, meController.savePlaylist);

// [DELETE] /api/me/playlists => remove saved playlist from library
router.delete('/playlists', userAuth, meController.removeSavedPlaylist);

// [GET] /api/me/tracks => get liked tracks
router.get('/tracks', userAuth, meController.getLikedTracks);

// [PUT] /api/me/tracks => save liked track to library
router.put('/tracks', userAuth, meController.saveTrack);

// [DELETE] /api/me/tracks => remove liked track from library
router.delete('/tracks', userAuth, meController.removeLikedTrack);

// [PUT] /api/me/audio-player/pause => pause track
router.put('/audio-player/pause', userAuth, audioPlayerController.pause);

// [PUT] /api/me/audio-player/play => play(start/resume) track
router.put('/audio-player/play', userAuth, audioPlayerController.play);

// [PUT] /api/me/audio-player/repeat => set repeat mode
router.put('/audio-player/repeat', userAuth, audioPlayerController.setRepeat);

// [PUT] /api/me/audio-player/shuffle => set shuffle mode
router.put('/audio-player/shuffle', userAuth, audioPlayerController.setShuffle);

// [POST] /api/me/audio-player/next =>  skip to next
router.post('/audio-player/next', userAuth, audioPlayerController.skipNext);

// [POST] /api/me/audio-player/previous =>  skip to previous
router.post('/audio-player/previous', userAuth, audioPlayerController.skipPrevious);

// [PUT] /api/me/audio-player/volume =>  set volume
router.put('/audio-player/volume', userAuth, audioPlayerController.setVolume);

module.exports = router;
