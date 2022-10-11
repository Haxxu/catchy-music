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

        const playWithShuffleOff = function (player, tracks, contextType, contextId, trackId, albumId, position) {
            let index;
            if (position && tracks[position]?.track + tracks[position]?.album === trackId + albumId) {
                index = position;
            } else {
                index = tracks.map((obj) => obj.track + obj.album).indexOf(trackId + albumId);
            }
            if (index !== -1) {
                player.currentPlayingTrack.track = tracks[index].track;
                player.currentPlayingTrack.album = tracks[index].album;
                player.currentPlayingTrack.context_uri = req.body.context_uri;
                player.currentPlayingTrack.position = index;
                player.shuffleTracks = [];
                player.shufflePosition = -1;
            }
        };

        const playWithShuffleOn = function (player, tracks, contextType, contextId, trackId, albumId, position) {
            tracks = tracks.map((obj, index) => ({ ...obj, position: index }));
            const shuffleTracks = shuffleArray(tracks);

            let indexInShuffle = shuffleTracks.map((obj) => obj.track + obj.album).indexOf(trackId + albumId);
            if (indexInShuffle !== -1) {
                player.currentPlayingTrack.track = shuffleTracks[indexInShuffle].track;
                player.currentPlayingTrack.album = shuffleTracks[indexInShuffle].album;
                player.currentPlayingTrack.position = shuffleTracks[indexInShuffle].position;
                player.currentPlayingTrack.context_uri = req.body.context_uri;
                player.shuffleTracks = shuffleTracks.map((obj) => ({
                    track: obj.track,
                    album: obj.album,
                    context_uri: contextType + ':' + contextId + ':' + obj.track + ':' + obj.album,
                    position: obj.position,
                }));
                player.shufflePosition = indexInShuffle;
            }
        };

        if (player.shuffle === 'none') {
            if (contextType === 'album') {
                const album = await Album.findOne({ _id: contextId });
                if (!album) {
                    return res.status(404).send({ message: 'Album does not exist' });
                }
                playWithShuffleOff(
                    player,
                    album.tracks.map((obj) => ({ track: obj.track, album: albumId })),
                    contextType,
                    contextId,
                    trackId,
                    albumId,
                    req.body.position,
                );
            } else if (contextType === 'playlist') {
                const playlist = await Playlist.findOne({ _id: contextId });
                if (!playlist) {
                    return res.status(404).send({ message: 'Playlist does not exist' });
                }
                playWithShuffleOff(
                    player,
                    playlist.tracks,
                    contextType,
                    contextId,
                    trackId,
                    albumId,
                    req.body.position,
                );
            } else if (contextType === 'liked') {
                const library = await Library.findOne({ _id: contextId });
                if (!library) {
                    return res.status(404).send({ message: 'Library does not exist' });
                }
                playWithShuffleOff(
                    player,
                    library.likedTracks,
                    contextType,
                    contextId,
                    trackId,
                    albumId,
                    req.body.position,
                );
            }
        } else {
            // Che do shuffle
            if (contextType === 'album') {
                const album = await Album.findOne({ _id: contextId });
                if (!album) {
                    return res.status(404).send({ message: 'Album does not exist' });
                }
                playWithShuffleOn(
                    player,
                    album.tracks.map((obj) => ({ track: obj.track, album: albumId })),
                    contextType,
                    contextId,
                    trackId,
                    albumId,
                    req.body.position,
                );
            } else if (contextType === 'playlist') {
                const playlist = await Playlist.findOne({ _id: contextId });
                if (!playlist) {
                    return res.status(404).send({ message: 'Playlist does not exist' });
                }
                playWithShuffleOn(player, playlist.tracks, contextType, contextId, trackId, albumId, req.body.position);
            } else if (contextType === 'liked') {
                const library = await Library.findOne({ _id: contextId });
                if (!library) {
                    return res.status(404).send({ message: 'Library does not exist' });
                }
                playWithShuffleOn(
                    player,
                    library.likedTracks,
                    contextType,
                    contextId,
                    trackId,
                    albumId,
                    req.body.position,
                );
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

            const skipNextWithShuffleOff = function (player, tracks, contextType, contextId, trackId, albumId) {
                let index = player.currentPlayingTrack.position;
                if (!tracks[index] || tracks[index]?.track + tracks[index]?.album !== trackId + albumId) {
                    index = tracks.map((obj) => obj.track + obj.album).indexOf(trackId + albumId);
                }
                if (index !== -1) {
                    let nextIndex = index + 1 < tracks.length ? index + 1 : 0;
                    player.currentPlayingTrack.track = tracks[nextIndex].track;
                    player.currentPlayingTrack.album = tracks[nextIndex].album;
                    player.currentPlayingTrack.context_uri =
                        contextType + ':' + contextId + ':' + tracks[nextIndex].track + ':' + tracks[nextIndex].album;
                    player.currentPlayingTrack.position = nextIndex;
                } else {
                    player.currentPlayingTrack.track = '';
                    player.currentPlayingTrack.album = '';
                    player.currentPlayingTrack.context_uri = '';
                    player.currentPlayingTrack.position = -1;
                }
            };

            const skipNextWithShuffleOn = function (player, tracks, contextType, contextId, trackId, albumId) {
                let index, indexInShuffle, nextIndex, nextIndexInShuffle;
                index = player.currentPlayingTrack.position;
                indexInShuffle = player.shufflePosition;

                if (!tracks[index] || tracks[index]?.track + tracks[index]?.album !== trackId + albumId) {
                    index = tracks.map((obj) => obj.track + obj.album).indexOf(trackId + albumId);
                }
                if (
                    !player.shuffleTracks[indexInShuffle] ||
                    player.shuffleTracks[indexInShuffle]?.track + player.shuffleTracks[indexInShuffle]?.album !==
                        trackId + albumId
                ) {
                    indexInShuffle = player.shuffleTracks
                        .map((obj) => obj.track + obj.album)
                        .indexOf(trackId + albumId);
                }

                if (index !== -1 && indexInShuffle !== -1) {
                    let shuffleTracksLength = player.shuffleTracks.length;
                    nextIndexInShuffle = indexInShuffle + 1 < shuffleTracksLength ? indexInShuffle + 1 : 0;
                    nextIndex = tracks
                        .map((obj) => obj.track + obj.album)
                        .indexOf(
                            player.shuffleTracks[nextIndexInShuffle].track +
                                player.shuffleTracks[nextIndexInShuffle].album,
                        );
                    let updatedTracksLength = tracks.length;
                    if (nextIndex === -1 || updatedTracksLength !== shuffleTracksLength) {
                        tracks = tracks.map((obj, index) => ({ ...obj, position: index }));
                        const shuffleTracks = shuffleArray(tracks);
                        player.shuffleTracks = shuffleTracks.map((obj) => ({
                            track: obj.track,
                            album: obj.album,
                            context_uri: contextType + ':' + contextType + ':' + obj.track + ':' + obj.album,
                            position: obj.position,
                        }));
                        indexInShuffle = player.shuffleTracks
                            .map((obj) => obj.track + obj.album)
                            .indexOf(trackId + albumId);
                        nextIndexInShuffle = indexInShuffle + 1 < updatedTracksLength ? indexInShuffle + 1 : 0;
                    }
                    player.currentPlayingTrack.track = player.shuffleTracks[nextIndexInShuffle].track;
                    player.currentPlayingTrack.album = player.shuffleTracks[nextIndexInShuffle].album;
                    player.currentPlayingTrack.context_uri =
                        contextType +
                        ':' +
                        contextId +
                        ':' +
                        player.currentPlayingTrack.track +
                        ':' +
                        player.currentPlayingTrack.album;
                    player.currentPlayingTrack.position = player.shuffleTracks[nextIndexInShuffle].position;
                    player.shufflePosition = nextIndexInShuffle;
                } else {
                    player.currentPlayingTrack.track = '';
                    player.currentPlayingTrack.album = '';
                    player.currentPlayingTrack.context_uri = '';
                    player.currentPlayingTrack.position = -1;
                    player.shuffleTracks = [];
                    player.shufflePosition = -1;
                }
            };

            if (player.shuffle === 'none') {
                if (contextType === 'album') {
                    const album = await Album.findOne({ _id: contextId });
                    if (!album) {
                        return res.status(404).send({ message: 'Album not found' });
                    }
                    skipNextWithShuffleOff(
                        player,
                        album.tracks.map((obj) => ({ track: obj.track, album: albumId })),
                        contextType,
                        contextId,
                        trackId,
                        albumId,
                    );
                } else if (contextType === 'playlist') {
                    const playlist = await Playlist.findOne({ _id: contextId });
                    if (!playlist) {
                        return res.status(404).send({ message: 'Playlist not found' });
                    }
                    skipNextWithShuffleOff(player, playlist.tracks, contextType, contextId, trackId, albumId);
                } else if (contextType === 'liked') {
                    const library = await Library.findOne({ _id: contextId });
                    if (!library) {
                        return res.status(404).send({ message: 'Library not found' });
                    }
                    skipNextWithShuffleOff(player, library.likedTracks, contextType, contextId, trackId, albumId);
                }
            } else {
                // Che do shuffle
                if (contextType === 'album') {
                    const album = await Album.findOne({ _id: contextId });
                    if (!album) {
                        return res.status(404).send({ message: 'Album not found' });
                    }
                    skipNextWithShuffleOn(
                        player,
                        album.tracks.map((obj) => ({ track: obj.track, album: albumId })),
                        contextType,
                        contextId,
                        trackId,
                        albumId,
                    );
                } else if (contextType === 'playlist') {
                    const playlist = await Playlist.findOne({ _id: contextId });
                    if (!playlist) {
                        return res.status(404).send({ message: 'Playlist not found' });
                    }
                    skipNextWithShuffleOn(player, playlist.tracks, contextType, contextId, trackId, albumId);
                } else if (contextType === 'liked') {
                    const library = await Library.findOne({ _id: contextId });
                    if (!library) {
                        return res.status(404).send({ message: 'Library not found' });
                    }
                    skipNextWithShuffleOn(player, library.likedTracks, contextType, contextId, trackId, albumId);
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

            const skipPreviousWithShuffleOff = function (player, tracks, contextType, contextId, trackId, albumId) {
                // nextIndex here (skip previous) mean previous of tracks order (will play)
                let index = player.currentPlayingTrack.position;
                if (!tracks[index] || tracks[index]?.track + tracks[index]?.album !== trackId + albumId) {
                    index = tracks.map((obj) => obj.track + obj.album).indexOf(trackId + albumId);
                }
                if (index !== -1) {
                    let nextIndex = index - 1 >= 0 ? index - 1 : 0;
                    player.currentPlayingTrack.track = tracks[nextIndex].track;
                    player.currentPlayingTrack.album = tracks[nextIndex].album;
                    player.currentPlayingTrack.context_uri =
                        contextType + ':' + contextId + ':' + tracks[nextIndex].track + ':' + tracks[nextIndex].album;
                    player.currentPlayingTrack.position = nextIndex;
                } else {
                    player.currentPlayingTrack.track = '';
                    player.currentPlayingTrack.album = '';
                    player.currentPlayingTrack.context_uri = '';
                    player.currentPlayingTrack.position = -1;
                }
            };

            const skipPreviousWithShuffleOn = function (player, tracks, contextType, contextId, trackId, albumId) {
                // nextIndex here (skip previous) mean previous of tracks order (will play)
                // nextIndexInShuffle here (skip previous) mean previous of shuffle tracks order (will play)
                let index, indexInShuffle, nextIndex, nextIndexInShuffle;
                index = player.currentPlayingTrack.position;
                indexInShuffle = player.shufflePosition;

                if (!tracks[index] || tracks[index]?.track + tracks[index]?.album !== trackId + albumId) {
                    index = tracks.map((obj) => obj.track + obj.album).indexOf(trackId + albumId);
                }
                if (
                    !player.shuffleTracks[indexInShuffle] ||
                    player.shuffleTracks[indexInShuffle]?.track + player.shuffleTracks[indexInShuffle]?.album !==
                        trackId + albumId
                ) {
                    indexInShuffle = player.shuffleTracks
                        .map((obj) => obj.track + obj.album)
                        .indexOf(trackId + albumId);
                }

                if (index !== -1 && indexInShuffle !== -1) {
                    nextIndexInShuffle = indexInShuffle - 1 >= 0 ? indexInShuffle - 1 : 0;
                    nextIndex = tracks
                        .map((obj) => obj.track + obj.album)
                        .indexOf(
                            player.shuffleTracks[nextIndexInShuffle].track +
                                player.shuffleTracks[nextIndexInShuffle].album,
                        );
                    if (nextIndex === -1 || tracks.length !== player.shuffleTracks.length) {
                        tracks = tracks.map((obj, index) => ({ ...obj, position: index }));
                        const shuffleTracks = shuffleArray(tracks);
                        player.shuffleTracks = shuffleTracks.map((obj) => ({
                            track: obj.track,
                            album: obj.album,
                            context_uri: contextType + ':' + contextType + ':' + obj.track + ':' + obj.album,
                            position: obj.position,
                        }));
                        indexInShuffle = player.shuffleTracks
                            .map((obj) => obj.track + obj.album)
                            .indexOf(trackId + albumId);
                        nextIndexInShuffle = indexInShuffle - 1 >= 0 ? indexInShuffle - 1 : 0;
                    }
                    player.currentPlayingTrack.track = player.shuffleTracks[nextIndexInShuffle].track;
                    player.currentPlayingTrack.album = player.shuffleTracks[nextIndexInShuffle].album;
                    player.currentPlayingTrack.context_uri =
                        contextType +
                        ':' +
                        contextId +
                        ':' +
                        player.currentPlayingTrack.track +
                        ':' +
                        player.currentPlayingTrack.album;
                    player.currentPlayingTrack.position = player.shuffleTracks[nextIndexInShuffle].position;
                    player.shufflePosition = nextIndexInShuffle;
                } else {
                    player.currentPlayingTrack.track = '';
                    player.currentPlayingTrack.album = '';
                    player.currentPlayingTrack.context_uri = '';
                    player.currentPlayingTrack.position = -1;
                    player.shuffleTracks = [];
                    player.shufflePosition = -1;
                }
            };

            if (player.shuffle === 'none') {
                if (contextType === 'album') {
                    const album = await Album.findOne({ _id: contextId });
                    if (!album) {
                        return res.status(404).send({ message: 'Album not found' });
                    }
                    skipPreviousWithShuffleOff(
                        player,
                        album.tracks.map((obj) => ({ track: obj.track, album: albumId })),
                        contextType,
                        contextId,
                        trackId,
                        albumId,
                    );
                } else if (contextType === 'playlist') {
                    const playlist = await Playlist.findOne({ _id: contextId });
                    if (!playlist) {
                        return res.status(404).send({ message: 'Playlist not found' });
                    }
                    skipPreviousWithShuffleOff(player, playlist.tracks, contextType, contextId, trackId, albumId);
                } else if (contextType === 'liked') {
                    const library = await Library.findOne({ _id: contextId });
                    if (!library) {
                        return res.status(404).send({ message: 'Library not found' });
                    }
                    skipPreviousWithShuffleOff(player, library.likedTracks, contextType, contextId, trackId, albumId);
                }
            } else {
                // Che do shuffle
                if (contextType === 'album') {
                    const album = await Album.findOne({ _id: contextId });
                    if (!album) {
                        return res.status(404).send({ message: 'Album not found' });
                    }
                    skipPreviousWithShuffleOn(
                        player,
                        album.tracks.map((obj) => ({ track: obj.track, album: albumId })),
                        contextType,
                        contextId,
                        trackId,
                        albumId,
                    );
                } else if (contextType === 'playlist') {
                    const playlist = await Playlist.findOne({ _id: contextId });
                    if (!playlist) {
                        return res.status(404).send({ message: 'Playlist not found' });
                    }
                    skipPreviousWithShuffleOn(player, playlist.tracks, contextType, contextId, trackId, albumId);
                } else if (contextType === 'liked') {
                    const library = await Library.findOne({ _id: contextId });
                    if (!library) {
                        return res.status(404).send({ message: 'Library not found' });
                    }
                    skipPreviousWithShuffleOn(player, library.likedTracks, contextType, contextId, trackId, albumId);
                }
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
