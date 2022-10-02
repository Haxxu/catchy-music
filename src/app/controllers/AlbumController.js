const mongoose = require('mongoose');

const { Album, validateAlbum } = require('../models/Album');
const { Library } = require('../models/Library');
const { Playlist } = require('../models/Playlist');
const { Track } = require('../models/Track');

class AlbumController {
    // get album by id (get released album or album artist own)
    async getAlbumById(req, res, next) {
        const album = await Album.findById(req.params.id);
        if (!album) {
            return res.status(404).send({ message: 'Album does not exist' });
        }

        if (album.isReleased || album.owner.toString() === req.user._id)
            res.status(200).send({ data: album, message: 'Get album successfully' });

        res.status(403).send({ message: 'Album does not release' });
    }

    // create new album
    async createAlbum(req, res, next) {
        const { error } = validateAlbum(req.body);
        if (error) {
            return res.status(400).send({ message: error.details[0].message });
        }

        const tracks = [...req.body.tracks];
        var mes = '';
        tracks.forEach(async (track) => {
            const isExist = await Track.findOne({ _id: track, owner: req.user._id });
            if (!isExist) {
                const index = req.body.tracks.indexOf(track);
                if (index > -1) {
                    req.body.tracks.splice(index, 1);
                }
                mes = mes + track + ', ';
            }
        });

        const album = await new Album({
            ...req.body,
            owner: req.user._id,
        }).save();

        await Library.updateOne(
            { owner: req.user._id },
            { $push: { albums: { album: album._id, dateAdded: Date.now() } } },
        );

        res.status(200).send({
            data: album,
            message: mes === '' ? 'Create album successfully' : 'Can not add track to album: ' + mes,
        });
    }

    // update album
    async updateAlbum(req, res, next) {
        const { error } = validateAlbum(req.body);
        if (error) {
            return res.status(400).send({ message: error.details[0].message });
        }

        const album = await Album.findById(req.params.id);
        if (!album) {
            return res.status(400).send({ message: 'Album does not exist' });
        }

        if (req.user._id !== album.owner.toString()) {
            return res.status(403).send({ message: "You don't have permission to perform this action" });
        }

        var tracks = [...req.body.tracks];
        var mes = '';
        tracks.forEach(async (track) => {
            const isExist = await Track.findOne({ _id: track, owner: req.user._id });
            if (!isExist) {
                const index = req.body.tracks.indexOf(track);
                if (index > -1) {
                    req.body.tracks.splice(index, 1);
                }
                mes = mes + track + ', ';
            }
        });

        if (req.body.isReleased && !album.isReleased) {
            req.body.releaseDate = Date.now();
        }

        const updatedAlbum = await Album.findOneAndUpdate({ _id: req.params.id }, { $set: req.body }, { new: true });

        res.status(200).send({
            data: updatedAlbum,
            message: mes === '' ? 'Updated album successfully' : 'Can not add track to album: ' + mes,
        });
    }

    async deleteAlbum(req, res, next) {
        const album = await Album.findOne({ _id: req.params.id });
        if (!album) {
            return res.status(404).send({ message: 'Album does not exist' });
        }
        if (album.owner.toString() !== req.user._id) {
            return res.status(403).send({ message: "User doesn't have access to delete" });
        }

        // Delete album in Library
        await Library.updateMany(
            {},
            {
                $pull: {
                    albums: { album: req.params.id },
                },
            },
        );
        // Delete album in library likedTracks
        await Library.updateMany(
            {},
            {
                $pull: {
                    likedTracks: { album: req.params.id },
                },
            },
        );
        // Delete album in playlists
        await Playlist.updateMany(
            {},
            {
                $pull: {
                    tracks: { album: req.params.id },
                },
            },
        );

        await Album.findByIdAndRemove(req.params.id);

        res.status(200).send({ message: 'Delete album successfully' });
    }

    async toggleReleaseAlbum(req, res, next) {
        const album = await Album.findOne({ _id: req.params.id });
        if (!album) {
            return res.status(404).send({ message: 'Album does not exist' });
        }
        if (album.owner.toString() !== req.user._id) {
            return res.status(403).send({ message: "You don't have permision to toggle release this album" });
        }

        var flag = await album.isReleased;
        var message = '';
        if (flag) {
            message = 'Unreleased album successfully';
        } else {
            message = 'Released album successfully';
        }
        await album.updateOne({ isReleased: !flag, releaseDate: Date.now() });

        res.status(200).send({ message: message });
    }

    async addTrackToAlbum(req, res, next) {
        if (!mongoose.isValidObjectId(req.body.track)) {
            return res.status(404).send({ message: 'Invalid ID' });
        }

        const album = await Album.findOne({ _id: req.params.id }).select('-__v');
        if (!album) {
            return res.status(404).send({ message: 'Album does not exist' });
        }

        const track = await Track.findOne({ _id: req.body.track }).select('-__v');
        if (!track) {
            return res.status(404).send({ message: 'Track does not exist' });
        }

        if (album.owner.toString() !== req.user._id || track.owner.toString() !== req.user._id) {
            return res.status(403).send({ message: "User don't have access to add" });
        }

        if (album.tracks.indexOf(req.body.track) !== -1) {
            return res.status(404).send({ message: 'Track already in album' });
        } else {
            album.tracks.push(req.body.track);
        }

        await album.save();

        res.status(200).send({ data: album, message: 'Added to album' });
    }

    async removeTrackFromAlbum(req, res, next) {
        if (!mongoose.isValidObjectId(req.body.track)) {
            return res.status(404).send({ message: 'Invalid ID' });
        }

        const album = await Album.findOne({ _id: req.params.id }).select('-__v');
        if (!album) {
            return res.status(404).send({ message: 'Album does not exist' });
        }

        const track = await Track.findOne({ _id: req.body.track }).select('-__v');
        if (!track) {
            return res.status(404).send({ message: 'Track does not exist' });
        }

        if (album.owner.toString() !== req.user._id || track.owner.toString() !== req.user._id) {
            return res.status(403).send({ message: "User don't have access to remove" });
        }

        var index = album.tracks.indexOf(req.body.track);
        if (index === -1) {
            return res.status(404).send({ message: 'Track does not in album' });
        } else {
            album.tracks.splice(index, 1);
        }

        await album.save();

        res.status(200).send({ data: album, message: 'Removed from album' });
    }
}

module.exports = new AlbumController();