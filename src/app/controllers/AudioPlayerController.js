const { Album } = require('../models/Album');
const { AudioPlayer } = require('../models/AudioPlayer');
const { Library } = require('../models/Library');
const { Playlist } = require('../models/Playlist');
class AudioPlayerController {
    async play(req, res, next) {
        const player = await AudioPlayer.findOne({ owner: req.user._id });
        if (!player) {
            return res.status(404).send({ message: 'AudioPlayer does not exist' });
        }

        if (!req.body.context_uri) {
            player.isPlaying = true;
            await player.save();
            return res.status(200).send({ message: 'Resume track succesffuly' });
        }

        const [contextType, contextId, trackId, albumId] = req.body.context_uri.split(':');

        if (player.shuffle === 'none') {
            if (contextType === 'album') {
                const album = await Album.findOne({ _id: contextId });
                if (!album) {
                    return res.status(404).send({ message: 'Album does not exist' });
                }
                let index = album.tracks.map((obj) => obj.track).indexOf(trackId);
                if (index !== -1) {
                    player.currentPlayingTrack.track = trackId;
                    player.currentPlayingTrack.album = albumId;
                    player.currentPlayingTrack.position = index;
                    player.currentPlayingTrack.context_uri = req.body.context_uri;
                }
            } else if (contextType === 'playlist') {
                const playlist = await Playlist.findOne({ _id: contextId });
                if (!playlist) {
                    return res.status(404).send({ message: 'Playlist does not exist' });
                }
                let index = playlist.tracks.map((obj) => obj.track + obj.album).indexOf(trackId + albumId);
                if (index !== -1) {
                    player.currentPlayingTrack.track = trackId;
                    player.currentPlayingTrack.album = albumId;
                    player.currentPlayingTrack.position = index;
                    player.currentPlayingTrack.context_uri = req.body.context_uri;
                }
            } else if (contextType === 'liked') {
                const library = await Library.findOne({ _id: contextId });
                if (!library) {
                    return res.status(404).send({ message: 'Library does not exist' });
                }
                let index = library.likedTracks.map((obj) => obj.track + obj.album).indexOf(trackId + albumId);
                if (index !== -1) {
                    player.currentPlayingTrack.track = trackId;
                    player.currentPlayingTrack.album = albumId;
                    player.currentPlayingTrack.position = index;
                    player.currentPlayingTrack.context_uri = req.body.context_uri;
                }
            }
        } else {
            // Che do shuffle
            if (contextType === 'album') {
                const album = await Album.findOne({ _id: contextId });
                if (!album) {
                    return res.status(404).send({ message: 'Album does not exist' });
                }
                const shuffleTracks = shuffleArray(album.tracks);

                let index = shuffleTracks.map((obj) => obj.track).indexOf(trackId);
                if (index !== -1) {
                    player.currentPlayingTrack.track = trackId;
                    player.currentPlayingTrack.album = albumId;
                    player.currentPlayingTrack.position = index;
                    player.currentPlayingTrack.context_uri = req.body.context_uri;
                    player.shuffleTracks = shuffleTracks.map((obj, index) => ({
                        track: obj.track,
                        album: albumId,
                        context_uri: contextType + ':' + contextId + ':' + obj.track + ':' + albumId,
                        position: index,
                    }));
                }
            } else if (contextType === 'playlist') {
                const playlist = await Playlist.findOne({ _id: contextId });
                if (!playlist) {
                    return res.status(404).send({ message: 'Playlist does not exist' });
                }

                const shuffleTracks = shuffleArray(playlist.tracks);
                let index = shuffleTracks.map((obj) => obj.track + obj.album).indexOf(trackId + albumId);
                if (index !== -1) {
                    player.currentPlayingTrack.track = trackId;
                    player.currentPlayingTrack.album = albumId;
                    player.currentPlayingTrack.position = index;
                    player.currentPlayingTrack.context_uri = req.body.context_uri;
                    player.shuffleTracks = shuffleTracks.map((obj, index) => ({
                        track: obj.track,
                        album: albumId,
                        context_uri: contextType + ':' + contextId + ':' + obj.track + ':' + albumId,
                        position: index,
                    }));
                }
            } else if (contextType === 'liked') {
                const library = await Library.findOne({ _id: contextId });
                if (!library) {
                    return res.status(404).send({ message: 'Library does not exist' });
                }

                const shuffleTracks = shuffleArray(library.likedTracks);
                let index = library.likedTracks.map((obj) => obj.track + obj.album).indexOf(trackId + albumId);
                if (index !== -1) {
                    player.currentPlayingTrack.track = trackId;
                    player.currentPlayingTrack.album = albumId;
                    player.currentPlayingTrack.position = index;
                    player.currentPlayingTrack.context_uri = req.body.context_uri;
                    player.shuffleTracks = shuffleTracks.map((obj, index) => ({
                        track: obj.track,
                        album: albumId,
                        context_uri: contextType + ':' + contextId + ':' + obj.track + ':' + albumId,
                        position: index,
                    }));
                }
            }
        }

        await player.save();
        res.status(200).send({ message: 'Start track successfuly' });
    }

    async skipToNext(req, res, next) {
        const player = await AudioPlayer.findOne({ owner: req.user._id });
        if (!player) {
            return res.status(404).send({ message: 'Audio player not found' });
        }
        if (player.currentPlayingTrack.position === -1 || player.currentPlayingTrack.track === '') {
            // doi sang track ngau nhien
        } else {
            const [contextType, contextId, trackId, albumId] = player.currentPlayingTrack.context_uri.split(':');

            if (player.shuffle === 'none') {
                if (contextType === 'album') {
                    const album = await Album.findOne({ _id: contextId });
                    if (!album) {
                        return res.status(404).send({ message: 'Album not found' });
                    }
                    let index = album.tracks.map((obj) => obj.track).indexOf(trackId);
                    if (index !== -1) {
                        let nextIndex = index + 1 < album.tracks.length ? index + 1 : 0;
                        player.currentPlayingTrack.track = album.tracks[nextIndex].track;
                        player.currentPlayingTrack.album = albumId;
                        player.currentPlayingTrack.context_uri =
                            contextType + ':' + contextId + ':' + album.tracks[nextIndex].track + ':' + album._id;
                        player.position = nextIndex;
                    } else {
                        player.currentPlayingTrack.track = '';
                        player.currentPlayingTrack.album = '';
                        player.currentPlayingTrack.context_uri = '';
                        player.position = -1;
                    }
                } else if (contextType === 'playlist') {
                    const playlist = await Playlist.findOne({ _id: contextId });
                    if (!playlist) {
                        return res.status(404).send({ message: 'Playlist not found' });
                    }
                    let index = playlist.tracks.map((obj) => obj.track + obj.album).indexOf(trackId + albumId);
                    if (index !== -1) {
                        let nextIndex = index + 1 < playlist.tracks.length ? index + 1 : 0;
                        player.currentPlayingTrack.track = playlist.tracks[nextIndex].track;
                        player.currentPlayingTrack.album = playlist.tracks[nextIndex].album;
                        player.currentPlayingTrack.context_uri =
                            contextType +
                            ':' +
                            contextId +
                            ':' +
                            playlist.tracks[nextIndex].track +
                            ':' +
                            playlist.tracks[nextIndex].album;
                        player.position = nextIndex;
                    } else {
                        player.currentPlayingTrack.track = '';
                        player.currentPlayingTrack.album = '';
                        player.currentPlayingTrack.context_uri = '';
                        player.position = -1;
                    }
                } else if (contextType === 'liked') {
                    const library = await Library.findOne({ _id: contextId });
                    if (!library) {
                        return res.status(404).send({ message: 'Library not found' });
                    }
                    let index = library.likedTracks.map((obj) => obj.track + obj.album).indexOf(trackId + albumId);
                    if (index !== -1) {
                        let nextIndex = index + 1 < library.likedTracks.length ? index + 1 : 0;
                        player.currentPlayingTrack.track = library.likedTracks[nextIndex].track;
                        player.currentPlayingTrack.album = library.likedTracks[nextIndex].album;
                        player.currentPlayingTrack.context_uri =
                            contextType +
                            ':' +
                            contextId +
                            ':' +
                            library.likedTracks[nextIndex].track +
                            ':' +
                            library.likedTracks[nextIndex].album;
                        player.position = nextIndex;
                    } else {
                        player.currentPlayingTrack.track = '';
                        player.currentPlayingTrack.album = '';
                        player.currentPlayingTrack.context_uri = '';
                        player.position = -1;
                    }
                }
            } else {
                // Che do shuffle
                if (contextType === 'album') {
                    const album = await Album.findOne({ _id: contextId });
                    if (!album) {
                        return res.status(404).send({ message: 'Album not found' });
                    }
                    let index = album.tracks.map((obj) => obj.track).indexOf(trackId);
                    let indexInShuffle = player.shuffleTracks.map((obj) => obj.track).indexOf(trackId);

                    if (index !== -1 && indexInShuffle !== -1) {
                        let nextIndexInShuffle =
                            indexInShuffle + 1 < player.shuffleTracks.length ? indexInShuffle + 1 : 0;
                        let nextIndex = album.tracks
                            .map((obj) => obj.track)
                            .indexOf(player.shuffleTracks[nextIndexInShuffle].track);
                        if (nextIndex === -1) {
                            const shuffleTracks = shuffleArray(album.tracks);
                            player.shuffleTracks = shuffleTracks.map((obj, index) => ({
                                track: obj.track,
                                album: albumId,
                                context_uri: contextType + ':' + contextType + ':' + obj.track + ':' + albumId,
                                position: index,
                            }));
                            indexInShuffle = player.shuffleTracks.map((obj) => obj.track).indexOf(trackId);
                            nextIndexInShuffle =
                                indexInShuffle + 1 < player.shuffleTracks.length ? indexInShuffle + 1 : 0;
                        }
                        player.currentPlayingTrack.track = player.shuffleTracks[nextIndexInShuffle].track;
                        player.currentPlayingTrack.album = albumId;
                        player.currentPlayingTrack.context_uri =
                            contextType +
                            contextId +
                            ':' +
                            player.currentPlayingTrack.track +
                            ':' +
                            player.currentPlayingTrack.album;
                        player.currentPlayingTrack.position = player.shuffleTracks[nextIndexInShuffle].position;
                    } else {
                        player.currentPlayingTrack.track = '';
                        player.currentPlayingTrack.album = '';
                        player.currentPlayingTrack.context_uri = '';
                        player.position = -1;
                        player.shuffleTracks = [];
                    }
                } else if (contextType === 'playlist') {
                    const playlist = await Playlist.findOne({ _id: contextId });
                    if (!playlist) {
                        return res.status(404).send({ message: 'Playlist not found' });
                    }
                    let index = playlist.tracks.map((obj) => obj.track + obj.album).indexOf(trackId);
                    let indexInShuffle = player.shuffleTracks.map((obj) => obj.track + obj.album).indexOf(trackId);

                    if (index !== -1 && indexInShuffle !== -1) {
                        let nextIndexInShuffle =
                            indexInShuffle + 1 < player.shuffleTracks.length ? indexInShuffle + 1 : 0;
                        let nextIndex = playlist.tracks
                            .map((obj) => obj.track + obj.album)
                            .indexOf(
                                player.shuffleTracks[nextIndexInShuffle].track +
                                    player.shuffleTracks[nextIndexInShuffle].album,
                            );
                        if (nextIndex === -1) {
                            const shuffleTracks = shuffleArray(playlist.tracks);
                            player.shuffleTracks = shuffleTracks.map((obj, index) => ({
                                track: obj.track,
                                album: obj.album,
                                context_uri: contextType + ':' + contextType + ':' + obj.track + ':' + obj.album,
                                position: index,
                            }));
                            indexInShuffle = player.shuffleTracks
                                .map((obj) => obj.track + obj.album)
                                .indexOf(trackId + albumId);
                            nextIndexInShuffle =
                                indexInShuffle + 1 < player.shuffleTracks.length ? indexInShuffle + 1 : 0;
                        }
                        player.currentPlayingTrack.track = player.shuffleTracks[nextIndexInShuffle].track;
                        player.currentPlayingTrack.album = player.shuffleTracks[nextIndexInShuffle].album;
                        player.currentPlayingTrack.context_uri =
                            contextType +
                            contextId +
                            ':' +
                            player.currentPlayingTrack.track +
                            ':' +
                            player.currentPlayingTrack.album;
                        player.currentPlayingTrack.position = player.shuffleTracks[nextIndexInShuffle].position;
                    } else {
                        player.currentPlayingTrack.track = '';
                        player.currentPlayingTrack.album = '';
                        player.currentPlayingTrack.context_uri = '';
                        player.position = -1;
                        player.shuffleTracks = [];
                    }
                } else if (contextType === 'liked') {
                    const library = await Library.findOne({ _id: contextId });
                    if (!library) {
                        return res.status(404).send({ message: 'Library not found' });
                    }
                    let index = library.likedTracks.map((obj) => obj.track + obj.album).indexOf(trackId);
                    let indexInShuffle = player.shuffleTracks.map((obj) => obj.track + obj.album).indexOf(trackId);

                    if (index !== -1 && indexInShuffle !== -1) {
                        let nextIndexInShuffle =
                            indexInShuffle + 1 < player.shuffleTracks.length ? indexInShuffle + 1 : 0;
                        let nextIndex = library.likedTracks
                            .map((obj) => obj.track + obj.album)
                            .indexOf(
                                player.shuffleTracks[nextIndexInShuffle].track +
                                    player.shuffleTracks[nextIndexInShuffle].album,
                            );
                        if (nextIndex === -1) {
                            const shuffleTracks = shuffleArray(library.likedTracks);
                            player.shuffleTracks = shuffleTracks.map((obj, index) => ({
                                track: obj.track,
                                album: obj.album,
                                context_uri: contextType + ':' + contextType + ':' + obj.track + ':' + obj.album,
                                position: index,
                            }));
                            indexInShuffle = player.shuffleTracks
                                .map((obj) => obj.track + obj.album)
                                .indexOf(trackId + albumId);
                            nextIndexInShuffle =
                                indexInShuffle + 1 < player.shuffleTracks.length ? indexInShuffle + 1 : 0;
                        }
                        player.currentPlayingTrack.track = player.shuffleTracks[nextIndexInShuffle].track;
                        player.currentPlayingTrack.album = player.shuffleTracks[nextIndexInShuffle].album;
                        player.currentPlayingTrack.context_uri =
                            contextType +
                            contextId +
                            ':' +
                            player.currentPlayingTrack.track +
                            ':' +
                            player.currentPlayingTrack.album;
                        player.currentPlayingTrack.position = player.shuffleTracks[nextIndexInShuffle].position;
                    } else {
                        player.currentPlayingTrack.track = '';
                        player.currentPlayingTrack.album = '';
                        player.currentPlayingTrack.context_uri = '';
                        player.position = -1;
                        player.shuffleTracks = [];
                    }
                }
            }
        }

        await player.save();
        res.status(200).send({ message: 'skip to next' });
    }

    async skipToPrevious(req, res, next) {
        const player = await AudioPlayer.findOne({ owner: req.user._id });
        if (!player) {
            return res.status(404).send({ message: 'Audio player not found' });
        }
        if (player.currentPlayingTrack.position === -1) {
            // doi sang track ngau nhien
        } else {
            const [contextType, contextId, trackId, albumId] = player.currentPlayingTrack.context_uri.split(':');

            if (player.shuffle === 'none') {
                if (contextType === 'album') {
                    const album = await Album.findOne({ _id: contextId });
                    if (!album) {
                        return res.status(404).send({ message: 'Album not found' });
                    }
                    let index = album.tracks.map((obj) => obj.track).indexOf(trackId);
                    if (index !== -1) {
                        let nextIndex = index - 1 >= 0 ? index - 1 : 0;
                        player.currentPlayingTrack.track = album.tracks[nextIndex].track;
                        player.currentPlayingTrack.album = album._id;
                        player.currentPlayingTrack.context_uri =
                            contextType + ':' + contextId + ':' + album.tracks[nextIndex].track + ':' + album._id;
                        player.position = nextIndex;
                    } else {
                        player.currentPlayingTrack.track = '';
                        player.currentPlayingTrack.album = '';
                        player.currentPlayingTrack.context_uri = '';
                        player.position = -1;
                    }
                } else if (contextType === 'playlist') {
                    const playlist = await Playlist.findOne({ _id: contextId });
                    if (!playlist) {
                        return res.status(404).send({ message: 'Playlist not found' });
                    }
                    let index = playlist.tracks.map((obj) => obj.track + obj.album).indexOf(trackId + albumId);
                    if (index !== -1) {
                        let nextIndex = index - 1 >= 0 ? index - 1 : 0;
                        player.currentPlayingTrack.track = playlist.tracks[nextIndex].track;
                        player.currentPlayingTrack.album = playlist.tracks[nextIndex].album;
                        player.currentPlayingTrack.context_uri =
                            contextType +
                            ':' +
                            contextId +
                            ':' +
                            playlist.tracks[nextIndex].track +
                            ':' +
                            playlist.tracks[nextIndex].album;
                        player.position = nextIndex;
                    } else {
                        player.currentPlayingTrack.track = '';
                        player.currentPlayingTrack.album = '';
                        player.currentPlayingTrack.context_uri = '';
                        player.position = -1;
                    }
                } else if (contextType === 'liked') {
                    const library = await Library.findOne({ _id: contextId });
                    if (!library) {
                        return res.status(404).send({ message: 'Library not found' });
                    }
                    let index = library.likedTracks.map((obj) => obj.track + obj.album).indexOf(trackId + albumId);
                    if (index !== -1) {
                        let nextIndex = index - 1 >= 0 ? index - 1 : 0;
                        player.currentPlayingTrack.track = library.likedTracks[nextIndex].track;
                        player.currentPlayingTrack.album = library.likedTracks[nextIndex].album;
                        player.currentPlayingTrack.context_uri =
                            contextType +
                            ':' +
                            contextId +
                            ':' +
                            library.likedTracks[nextIndex].track +
                            ':' +
                            library.likedTracks[nextIndex].album;
                        player.position = nextIndex;
                    } else {
                        player.currentPlayingTrack.track = '';
                        player.currentPlayingTrack.album = '';
                        player.currentPlayingTrack.context_uri = '';
                        player.position = -1;
                    }
                }
            } else {
                // Che do shuffle
            }
        }

        await player.save();
        res.status(200).send({ message: 'skip to previous' });
    }
}

const shuffleArray = (array) => {
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

module.exports = new AudioPlayerController();
