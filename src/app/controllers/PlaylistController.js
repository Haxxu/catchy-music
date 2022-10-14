const mongoose = require('mongoose');

const { Playlist, validatePlaylist } = require('../models/Playlist');
const { Track } = require('../models/Track');
const { Album } = require('../models/Album');
const { Library } = require('../models/Library');
const { AudioPlayer } = require('../models/AudioPlayer');

class PlaylistController {
    // get playlist public or playlist (user own)
    async getPlaylistById(req, res, next) {
        const playlist = await Playlist.findOne({ _id: req.params.id })
            .populate({ path: 'owner', select: '_id name' })
            .select('-__v');
        if (!playlist) {
            return res.status(404).send({ message: 'Playlist does not exist' });
        }

        if (playlist.isPublic || req.user._id === playlist.owner._id.toString()) {
            const detailTracks = [];
            let position = 0;

            for (let track of playlist.tracks) {
                const t = await Track.findOne({ _id: track.track });
                const a = await Album.findOne({ _id: track.album });
                detailTracks.push({
                    ...track.toObject(),
                    track: t,
                    album: a,
                    context_uri: 'playlist' + ':' + playlist._id + ':' + t._id + ':' + a._id,
                    position: position,
                });
                position++;
            }

            res.status(200).send({
                data: { ...playlist.toObject(), tracks: detailTracks },
                message: 'Get playlist successfully',
            });
        } else {
            res.status(403).send({ message: 'Playlist does not public' });
        }
    }

    async createPlaylist(req, res, next) {
        const { error } = validatePlaylist(req.body);
        if (error) {
            return res.status(404).send({ message: error.details[0].message });
        }

        const playlist = await new Playlist({
            ...req.body,
            owner: req.user._id,
        }).save();

        await Library.updateOne(
            { owner: req.user._id },
            { $push: { playlists: { playlist: playlist._id, addedAt: Date.now() } } },
        );

        res.status(200).send({ data: playlist, message: 'Playlist created successfully' });
    }

    async updatePlaylist(req, res, next) {
        const { error } = validatePlaylist(req.body);
        if (error) {
            return res.status(404).send({ message: error.details[0].message });
        }

        const playlist = await Playlist.findById(req.params.id).select('-__v');
        if (!playlist) {
            return res.status(404).send({ message: 'Playlist does not exist' });
        }

        if (req.user._id !== playlist.owner.toString()) {
            return res.status(403).send({ message: "You don't have permission to change this playlist" });
        }

        const newPlaylist = await Playlist.findOneAndUpdate({ _id: req.params.id }, { $set: req.body }, { new: true });

        res.status(200).send({ data: newPlaylist, message: 'Playlist updated successfully' });
    }

    async deletePlaylist(req, res, next) {
        const playlist = await Playlist.findOne({ _id: req.params.id });
        if (!playlist) {
            return res.status(404).send({ message: 'Playlist does not exist' });
        }
        if (playlist.owner.toString() !== req.user._id) {
            return res.status(403).send({ message: "User doesn't have access to delete" });
        }

        await Library.updateMany(
            {},
            {
                $pull: {
                    playlists: { playlist: req.params.id },
                },
            },
        );

        await Playlist.findByIdAndRemove(req.params.id);

        res.status(200).send({ message: 'Delete playlist successfully' });
    }

    async addTrackToPlaylist(req, res, next) {
        if (!mongoose.isValidObjectId(req.body.track)) {
            return res.status(404).send({ message: 'Invalid track ID' });
        }

        const playlist = await Playlist.findOne({ _id: req.params.id }).select('-__v');
        if (!playlist) {
            return res.status(404).send({ message: 'Playlist does not exist' });
        }
        if (playlist.owner.toString() !== req.user._id) {
            return res.status(403).send({ message: "User don't have access to add" });
        }

        const track = await Track.findOne({ _id: req.body.track }).select('-__v');
        if (!track) {
            return res.status(404).send({ message: 'Track does not exist' });
        }

        const album = await Album.findOne({ _id: req.body.album }).select('-__v');
        if (!album) {
            return res.status(404).send({ message: 'Album does not exist' });
        }
        if (album.tracks.map((obj) => obj.track).indexOf(req.body.track) === -1) {
            return res.status(404).send({ message: 'Add track to playlist failure' });
        }

        const index = playlist.tracks.map((obj) => obj.track).indexOf(req.body.track);
        if (index === -1) {
            playlist.tracks.push({
                track: req.body.track,
                album: req.body.album,
                addedAt: Date.now(),
            });
        }
        await playlist.save();

        res.status(200).send({ data: playlist, message: 'Added to playlist' });
    }

    async addTrackToPlaylist(req, res, next) {
        if (!mongoose.isValidObjectId(req.body.track) || !mongoose.isValidObjectId(req.body.album)) {
            return res.status(404).send({ message: 'Invalid ID' });
        }

        const playlist = await Playlist.findOne({ _id: req.params.id }).select('-__v');
        if (!playlist) {
            return res.status(404).send({ message: 'Playlist does not exist' });
        }
        if (playlist.owner.toString() !== req.user._id) {
            return res.status(403).send({ message: "User don't have access to add" });
        }

        const track = await Track.findOne({ _id: req.body.track }).select('-__v');
        if (!track) {
            return res.status(404).send({ message: 'Track does not exist' });
        }

        const album = await Album.findOne({ _id: req.body.album }).select('-__v');
        if (!album) {
            return res.status(404).send({ message: 'Album does not exist' });
        }
        if (album.tracks.map((obj) => obj.track).indexOf(req.body.track) === -1) {
            return res.status(404).send({ message: 'Add track to playlist failure' });
        }

        const index = playlist.tracks.map((obj) => obj.track).indexOf(req.body.track);
        if (index === -1) {
            playlist.tracks.push({
                track: req.body.track,
                album: req.body.album,
                addedAt: Date.now(),
            });
        }
        await playlist.save();

        res.status(200).send({ data: playlist, message: 'Added to playlist' });
    }

    async removeTrackFromPlaylist(req, res, next) {
        if (!mongoose.isValidObjectId(req.body.track) || !mongoose.isValidObjectId(req.body.album)) {
            return res.status(404).send({ message: 'Invalid ID' });
        }

        const playlist = await Playlist.findOne({ _id: req.params.id }).select('-__v');
        if (!playlist) {
            return res.status(404).send({ message: 'Playlist does not exist' });
        }
        if (playlist.owner.toString() !== req.user._id) {
            return res.status(403).send({ message: "User don't have access to add" });
        }

        const track = await Track.findOne({ _id: req.body.track }).select('-__v');
        if (!track) {
            return res.status(404).send({ message: 'Track does not exist' });
        }

        const album = await Album.findOne({ _id: req.body.album }).select('-__v');
        if (!album) {
            return res.status(404).send({ message: 'Album does not exist' });
        }
        if (album.tracks.map((obj) => obj.track).indexOf(req.body.track) === -1) {
            return res.status(404).send({ message: 'Add track to playlist failure' });
        }

        var index = -1;
        playlist.tracks.forEach((item, i) => {
            if (item.track.toString() === req.body.track && item.album.toString() === req.body.album) {
                index = i;
            }
        });
        if (index !== -1) {
            playlist.tracks.splice(index, 1);
        }
        await playlist.save();

        res.status(200).send({ data: playlist, message: 'Removed from playlist' });
    }

    // Get user playlists by user id
    async getUserPlaylists(req, res, next) {
        let playlists;
        if (req.user._id === req.params.id) {
            playlists = await Playlist.find({ owner: req.params.id }).populate({ path: 'owner', select: '_id name' });
        } else {
            playlists = await Playlist.find({ owner: req.params.id, isPublic: true }).populate({
                path: 'owner',
                select: '_id name',
            });
        }

        const detailPlaylists = [];
        for (let playlist of playlists) {
            const tracks = playlist.tracks;

            const detailTracks = [];
            let position = 0;
            for (let track of tracks) {
                const t = await Track.findOne({ _id: track.track });
                const a = await Album.findOne({ _id: track.album });
                detailTracks.push({
                    ...track.toObject(),
                    track: t,
                    album: a,
                    context_uri: 'playlist' + ':' + playlist._id + ':' + t._id + ':' + a._id,
                    position: position,
                });
                position++;
            }
            detailPlaylists.push({
                ...playlist.toObject(),
                tracks: detailTracks,
            });
        }

        res.status(200).send({ data: detailPlaylists, message: 'Get user playlists' });
    }
}

module.exports = new PlaylistController();
