const mongoose = require('mongoose');

const { Playlist, validatePlaylist } = require('../models/Playlist');
const { Track } = require('../models/Track');
const { Album } = require('../models/Album');
const { Library } = require('../models/Library');

class PlaylistController {
    // get playlist public or playlist (user own)
    async getPlaylistById(req, res, next) {
        const playlist = await Playlist.findOne({ _id: req.params.id }).select('-__v');
        if (!playlist) {
            return res.status(404).send({ message: 'Playlist does not exist' });
        }

        if (playlist.isPublic || req.user._id === playlist.owner.toString()) {
            res.status(200).send({ data: playlist, message: 'Get playlist successfully' });
        }

        res.status(403).send({ message: 'Playlist does not public' });
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
            { $push: { playlists: { playlist: playlist._id, dateAdded: Date.now() } } },
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
        if (album.tracks.indexOf(req.body.track) === -1) {
            return res.status(404).send({ message: 'Add track to playlist failure' });
        }

        const index = playlist.tracks.map((obj) => obj.track).indexOf(req.body.track);
        if (index === -1) {
            playlist.tracks.push({
                track: req.body.track,
                album: req.body.album,
                dateAdded: Date.now(),
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
        if (album.tracks.indexOf(req.body.track) === -1) {
            return res.status(404).send({ message: 'Add track to playlist failure' });
        }

        const index = playlist.tracks.map((obj) => obj.track).indexOf(req.body.track);
        if (index === -1) {
            playlist.tracks.push({
                track: req.body.track,
                album: req.body.album,
                dateAdded: Date.now(),
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
        if (album.tracks.indexOf(req.body.track) === -1) {
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
}

module.exports = new PlaylistController();
