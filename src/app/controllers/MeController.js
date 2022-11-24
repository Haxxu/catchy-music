const { User } = require('../models/User');
const { Library } = require('../models/Library');
const { Album } = require('../models/Album');
const { Playlist } = require('../models/Playlist');
const { Track } = require('../models/Track');

class MeController {
    // Get current user profile
    async getCurrentUserProfile(req, res, next) {
        const user = await User.findOne({ _id: req.user._id }).select('-password -__v');

        res.status(200).send({ data: user, message: 'Get user profile successfully' });
    }

    // Get liked tracks
    async getLikedTracks(req, res, next) {
        const library = await Library.findOne({ owner: req.user._id });
        if (!library) {
            return res.status(404).send({ message: 'Library not found' });
        }

        async function getLikedTrack(item, index) {
            const track = await Track.findOne({ _id: item.track });
            const album = await Album.findOne({ _id: item.album });
            return {
                track: track,
                album: album,
                addedAt: item.addedAt,
                context_uri: 'liked' + ':' + library._id.toString() + ':' + item.track + ':' + item.album,
                position: index,
            };
        }

        const likedTracks = await Promise.all(library.likedTracks.map(getLikedTrack));

        res.status(200).send({ data: likedTracks, message: 'Get liked tracks successfully' });
    }

    // Get following users
    async getFollowing(req, res, next) {
        const library = await Library.findOne({ owner: req.user._id });
        const followings = library.followings.map((item) => item.user);
        const artists = await User.find({ _id: { $in: followings }, type: 'artist' });
        const users = await User.find({ _id: { $in: followings } });

        res.status(200).send({ data: { artists: artists, users: users }, message: 'Get following user successfully' });
    }

    // Follow user or arist
    async followUser(req, res, next) {
        if (req.body.user === req.user._id) {
            return res.status(404).send({ message: 'Cannot perform this action' });
        }

        const userFollowLibrary = await Library.findOne({ owner: req.body.user });
        if (!userFollowLibrary) {
            return res.status(404).send({ message: 'User does not exist' });
        }

        const library = await Library.findOne({ owner: req.user._id });
        if (!library) {
            return res.status(404).send({ message: 'Cannot find user library' });
        }

        const index = library.followings.map((item) => item.user).indexOf(req.body.user);
        if (index === -1) {
            library.followings.push({
                user: req.body.user,
                addedAt: Date.now(),
            });
            userFollowLibrary.followers.push({
                user: req.user._id,
                addedAt: Date.now(),
            });
        }
        await library.save();
        await userFollowLibrary.save();

        res.status(200).send({ message: 'Follow user or artist successfully' });
    }

    // Unfollow user or arist
    async unfollowUser(req, res, next) {
        if (req.body.user === req.user._id) {
            return res.status(404).send({ message: 'Cannot perform this action' });
        }

        const userFollowLibrary = await Library.findOne({ owner: req.body.user });
        if (!userFollowLibrary) {
            return res.status(404).send({ message: 'User does not exist' });
        }

        const library = await Library.findOne({ owner: req.user._id });
        if (!library) {
            return res.status(404).send({ message: 'Cannot find user library' });
        }

        const indexFollowing = library.followings.map((item) => item.user).indexOf(req.body.user);
        if (indexFollowing !== -1) {
            library.followings.splice(indexFollowing, 1);
            const indexFollower = userFollowLibrary.followers.map((item) => item.user).indexOf(req.user._id);
            userFollowLibrary.followers.splice(indexFollower, 1);
        }

        await library.save();
        await userFollowLibrary.save();

        res.status(200).send({ message: 'Unfollow user or artist successfully' });
    }

    // Get saved albums
    async getSavedAlbums(req, res, next) {
        const library = await Library.findOne({ owner: req.user._id });

        const albums = [...library.albums];
        // Sort newest addedAt first
        albums.sort((a, b) => {
            return new Date(b.addedAt) - new Date(a.addedAt);
        });
        // Get saved albums ( array of album obj)
        const a = await Album.find({ _id: { $in: albums.map((item) => item.album) } });
        // array of album id
        const aClean = a.map((item) => item._id.toString());

        // Add album detail to savedAlbums
        const detailSavedAlbums = albums.map((obj) => {
            return {
                album: a[aClean.indexOf(obj.album)],
                addedAt: obj.addedAt,
            };
        });

        await res.status(200).send({ data: detailSavedAlbums, message: 'Get saved album successfully' });
    }

    // Save album to user library
    async saveAblum(req, res, next) {
        const album = await Album.findOne({ _id: req.body.album });
        if (!album) {
            return res.status(404).send({ message: 'Album does not exist' });
        }

        const library = await Library.findOne({ owner: req.user._id });
        if (!library) {
            return res.status(404).send({ message: 'Cannot find user library' });
        }

        const index = library.albums.map((item) => item.album).indexOf(req.body.album);
        if (index === -1) {
            library.albums.push({
                album: req.body.album,
                addedAt: Date.now(),
            });
            album.saved = album.saved + 1;
        }

        await library.save();
        await album.save();

        res.status(200).send({ message: 'Saved to library' });
    }

    // Remove album from user library
    async removeSavedAlbum(req, res, next) {
        const album = await Album.findOne({ _id: req.body.album });
        if (!album) {
            return res.status(404).send({ message: 'Album does not exist' });
        }

        if (album.owner.toString() === req.user._id) {
            return res.status(403).send({ message: 'You should not remove your album from your library' });
        }

        const library = await Library.findOne({ owner: req.user._id });
        if (!library) {
            return res.status(404).send({ message: 'Cannot find user library' });
        }

        const index = library.albums.map((item) => item.album).indexOf(req.body.album);
        if (index !== -1) {
            library.albums.splice(index, 1);
            album.saved = album.saved - 1;
            if (album.saved < 0) {
                album.saved = 0;
            }
        }

        await library.save();
        await album.save();

        res.status(200).send({ message: 'Removed from library' });
    }

    // Get saved playlist
    async getSavedPlaylists(req, res, next) {
        const library = await Library.findOne({ owner: req.user._id });

        const playlists = [...library.playlists];
        // Sort newest addedAt first
        playlists.sort((a, b) => {
            return new Date(b.addedAt) - new Date(a.addedAt);
        });
        // Get saved playlists ( array of playlist obj)
        const p = await Playlist.find({ _id: { $in: playlists.map((item) => item.playlist) } }).lean();
        // array of playlist id
        const pClean = p.map((item) => item._id.toString());

        // Add album detail to savedAlbums
        const detailSavedPlaylists = playlists.map((obj) => {
            let index = pClean.indexOf(obj.playlist);
            return {
                playlist: {
                    ...p[index],
                    firstTrack: {
                        context_uri: `playlist:${p[index]._id}:${p[index].tracks[0].track}:${p[index].tracks[0].album}`,
                        position: 0,
                    },
                },
                addedAt: obj.addedAt,
            };
        });

        await res.status(200).send({ data: detailSavedPlaylists, message: 'Get saved playlist successfully' });
    }

    // Save playlist to user library
    async savePlaylist(req, res, next) {
        const playlist = await Playlist.findOne({ _id: req.body.playlist });
        if (!playlist) {
            return res.status(404).send({ message: 'Playlist does not exist' });
        }

        const library = await Library.findOne({ owner: req.user._id });
        if (!library) {
            return res.status(404).send({ message: 'Cannot find user library' });
        }

        const index = library.playlists.map((item) => item.playlist).indexOf(req.body.playlist);
        if (index === -1) {
            library.playlists.push({
                playlist: req.body.playlist,
                addedAt: Date.now(),
            });
            playlist.saved = playlist.saved + 1;
        }

        await library.save();
        await playlist.save();

        res.status(200).send({ message: 'Saved to library' });
    }

    // Remove album from user library
    async removeSavedPlaylist(req, res, next) {
        const playlist = await Playlist.findOne({ _id: req.body.playlist });
        if (!playlist) {
            return res.status(404).send({ message: 'Playlist does not exist' });
        }

        if (playlist.owner.toString() === req.user._id) {
            return res.status(403).send({ message: 'You should not remove your playlist from your library' });
        }

        const library = await Library.findOne({ owner: req.user._id });
        if (!library) {
            return res.status(404).send({ message: 'Cannot find user library' });
        }

        const index = library.playlists.map((item) => item.playlist).indexOf(req.body.playlist);
        if (index !== -1) {
            library.playlists.splice(index, 1);
            playlist.saved = playlist.saved - 1;
            if (playlist.saved < 0) {
                playlist.saved = 0;
            }
        }

        await library.save();
        await playlist.save();

        res.status(200).send({ message: 'Removed from library' });
    }

    // Save track to user library
    async saveTrack(req, res, next) {
        const track = await Track.findOne({ _id: req.body.track });
        if (!track) {
            return res.status(404).send({ message: 'Track does not exist' });
        }
        const album = await Album.findOne({ _id: req.body.album });
        if (!album) {
            return res.status(404).send({ message: 'Album does not exist' });
        }

        // Check track in album
        const indexOfTrackInAlbum = album.tracks.map((obj) => obj.track).indexOf(req.body.track);
        if (indexOfTrackInAlbum === -1) {
            return res.status(404).send({ message: 'Track does not in album' });
        }

        const library = await Library.findOne({ owner: req.user._id });
        if (!library) {
            return res.status(404).send({ message: 'Cannot find user library' });
        }

        const index = library.likedTracks
            .map((item) => item.track + item.album)
            .indexOf(req.body.track + req.body.album);
        if (index === -1) {
            library.likedTracks.unshift({
                track: req.body.track,
                album: req.body.album,
                addedAt: Date.now(),
            });
            track.saved = track.saved + 1;
        }

        await library.save();
        await track.save();

        res.status(200).send({ message: 'Saved to library' });
    }

    // Remove track from user library
    async removeLikedTrack(req, res, next) {
        const track = await Track.findOne({ _id: req.body.track });
        if (!track) {
            return res.status(404).send({ message: 'Track does not exist' });
        }

        const album = await Album.findOne({ _id: req.body.album });
        if (!album) {
            return res.status(404).send({ message: 'Album does not exist' });
        }

        const library = await Library.findOne({ owner: req.user._id });
        if (!library) {
            return res.status(404).send({ message: 'Cannot find user library' });
        }

        const index = library.likedTracks
            .map((item) => item.track + item.album)
            .indexOf(req.body.track + req.body.album);
        if (index !== -1) {
            library.likedTracks.splice(index, 1);
            track.saved = track.saved - 1;
            if (track.saved < 0) {
                track.saved = 0;
            }
        }

        await library.save();
        await track.save();

        res.status(200).send({ message: 'Removed from library' });
    }
}

module.exports = new MeController();
