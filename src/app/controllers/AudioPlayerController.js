const { AudioPlayer } = require('../models/AudioPlayer');
const { Album } = require('../models/Album');
const { Track } = require('../models/Track');
const { Playlist } = require('../models/Playlist');
const { Library } = require('../models/Library');

class AudioPlayerController {
    async pause(req, res, next) {
        const player = await AudioPlayer.findOne({ owner: req.user._id });
        if (!player) {
            return res.status(404).send({ message: 'Audio Player does not exist' });
        }

        player.state = 'pause';
        await player.save();

        return res.status(200).send({ message: 'Pause track successfully' });
    }

    async play(req, res, next) {
        const player = await AudioPlayer.findOne({ owner: req.user._id });
        if (!player) {
            return res.status(404).send({ message: 'Audio Player does not exist' });
        }

        if (!req.body.context) {
            player.state = 'playing';
            await player.save();
            return res.status(200).send({ message: 'Resume track successfully' });
        } else {
            const context = req.body.context;
            const [contextType, contextId, trackId, albumId] = [...context.split(':')];

            const track = await Track.findOne({ _id: trackId });
            if (!track) {
                return res.status(404).send({ message: 'Track does not exist' });
            }
            const album = await Album.findOne({ _id: albumId });
            if (!album) {
                return res.status(404).send({ message: 'Album does not exist' });
            }
            if (album.tracks.map((obj) => obj.track).indexOf(trackId) === -1) {
                return res.status(404).send({ message: 'Track does in album' });
            }

            if (contextType === 'album') {
                if (contextId !== albumId) {
                    return res.status(404).send({ message: 'Album does not exist' });
                }

                // Change tracks in player when change to diffenrent album or from other type to album type
                if (player.context.type !== contextType || player.context.currentAlbum !== contextId) {
                    player.tracks = [
                        ...album.tracks.map((obj) => ({
                            track: obj.track,
                            album: contextId,
                            addedAt: obj.addedAt,
                        })),
                    ];
                }

                player.context = {
                    type: 'album',
                    currentPlaylist: '',
                    currentAlbum: contextId,
                    currentLiked: '',
                    currentArtist: '',
                };
            } else if (contextType === 'playlist') {
                const playlist = await Playlist.findOne({ _id: contextId });
                if (!playlist) {
                    return res.status(404).send({ message: 'Playlist does not exist' });
                }

                // Change tracks in player when change to diffenrent playlist or from  other type to playlist type
                if (player.context.type !== contextType || player.context.currentPlaylist !== contextId) {
                    player.tracks = [
                        ...playlist.tracks.map((obj) => ({
                            track: obj.track,
                            album: obj.album,
                            addedAt: obj.addedAt,
                        })),
                    ];
                }

                player.context = {
                    type: 'playlist',
                    currentPlaylist: contextId,
                    currentAlbum: '',
                    currentLiked: '',
                    currentArtist: '',
                };
            } else if (contextType === 'liked') {
                const library = await Library.findOne({ _id: contextId });
                if (!library) {
                    return res.status(404).send({ message: 'Library does not exist' });
                }

                // Change tracks in player when change to diffenrent playlist or from  other type to playlist type
                if (player.context.type !== contextType || player.context.currentLiked !== contextId) {
                    player.tracks = [
                        ...library.likedTracks.map((obj) => ({
                            track: obj.track,
                            album: obj.album,
                            addedAt: obj.addedAt,
                        })),
                    ];
                }

                player.context = {
                    type: 'liked',
                    currentPlaylist: '',
                    currentAlbum: '',
                    currentLiked: contextId,
                    currentArtist: '',
                };
            }

            player.state = 'playing';
            player.currentPlayingTrack = {
                track: trackId,
                album: albumId,
            };

            await player.save();
            return res.status(200).send({ message: 'Start track successfully' });
        }
    }

    async setRepeat(req, res, next) {
        const player = await AudioPlayer.findOne({ owner: req.user._id });
        if (!player) {
            return res.status(404).send({ message: 'Audio Player does not exist' });
        }
        if (!req.query.type) {
            player.repeat = 'none';
        } else if (req.query.type === 'repeat') {
            player.repeat = 'repeat';
        } else if (req.query.type === 'repeat-one') {
            player.repeat = 'repeat-one';
        } else {
            player.repeat = 'none';
        }
        await player.save();

        res.status(200).send({ message: 'Set repeat mode successfully' });
    }

    async setShuffle(req, res, next) {
        const shuffle = (array) => {
            const arr = [...array];
            let currentIndex = arr.length,
                randomIndex;

            while (currentIndex != 0) {
                randomIndex = Math.floor(Math.random() * currentIndex);
                currentIndex--;

                [arr[currentIndex], arr[randomIndex]] = [arr[randomIndex], arr[currentIndex]];
            }

            return arr;
        };

        const player = await AudioPlayer.findOne({ owner: req.user._id });
        if (!player) {
            return res.status(404).send({ message: 'Audio Player does not exist' });
        }
        if (!req.query.type) {
            player.shuffle = 'none';
            player.shuffleTracks = [];
            player.currentPlayingTrack.position = player.tracks
                .map((obj) => obj.track + obj.album)
                .indexOf(player.currentPlayingTrack.track + player.currentPlayingTrack.album);
        } else if (req.query.type === 'shuffle') {
            player.shuffle = 'shuffle';
            player.shuffleTracks = shuffle(player.tracks);
            player.currentPlayingTrack.position = player.shuffleTracks
                .map((obj) => obj.track + obj.album)
                .indexOf(player.currentPlayingTrack.track + player.currentPlayingTrack.album);
        } else {
            player.shuffle = 'none';
            player.shuffleTracks = [];
            player.currentPlayingTrack.position = player.tracks
                .map((obj) => obj.track + obj.album)
                .indexOf(player.currentPlayingTrack.track + player.currentPlayingTrack.album);
        }

        await player.save();

        res.status(200).send({ message: 'Set shuffle mode successfully' });
    }

    async skipNext(req, res, next) {
        const player = await AudioPlayer.findOne({ owner: req.user._id });
        if (!player) {
            return res.status(404).send({ message: 'Audio Player does not exist' });
        }

        if (player.currentPlayingTrack.track === '') {
            return res.status(403).send({ message: 'You should choose track to play' });
        }

        if (player.shuffle !== 'shuffle') {
            player.currentPlayingTrack.position--;
            if (player.currentPlayingTrack.position < 0) {
                player.currentPlayingTrack.position = player.tracks.length - 1;
            }
            player.currentPlayingTrack.album = player.tracks[player.currentPlayingTrack.position].album;
            player.currentPlayingTrack.track = player.tracks[player.currentPlayingTrack.position].track;
        } else {
            player.currentPlayingTrack.position--;
            if (player.currentPlayingTrack.position < 0) {
                player.currentPlayingTrack.position = player.shuffleTracks.length - 1;
            }
            player.currentPlayingTrack.album = player.shuffleTracks[player.currentPlayingTrack.position].album;
            player.currentPlayingTrack.track = player.shuffleTracks[player.currentPlayingTrack.position].track;
        }
        await player.save();
        res.status(200).send({ meesage: 'Skip next' });
    }

    async skipPrevious(req, res, next) {
        const player = await AudioPlayer.findOne({ owner: req.user._id });
        if (!player) {
            return res.status(404).send({ message: 'Audio Player does not exist' });
        }
        if (player.currentPlayingTrack.track === '') {
            return res.status(403).send({ message: 'You should choose track to play' });
        }

        if (player.shuffle !== 'shuffle') {
            player.currentPlayingTrack.position++;
            if (player.currentPlayingTrack.position >= player.tracks.length) {
                player.currentPlayingTrack.position--;
            }
            player.currentPlayingTrack.album = player.tracks[player.currentPlayingTrack.position].album;
            player.currentPlayingTrack.track = player.tracks[player.currentPlayingTrack.position].track;
        } else {
            player.currentPlayingTrack.position++;
            if (player.currentPlayingTrack.position >= player.tracks.length) {
                player.currentPlayingTrack.position--;
            }
            player.currentPlayingTrack.album = player.shuffleTracks[player.currentPlayingTrack.position].album;
            player.currentPlayingTrack.track = player.shuffleTracks[player.currentPlayingTrack.position].track;
        }
        await player.save();
        res.status(200).send({ meesage: 'Skip previous' });
    }
}

module.exports = new AudioPlayerController();
