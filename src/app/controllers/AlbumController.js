const { Album, validateAlbum } = require('../models/Album');
const { Track } = require('../models/Track');

class AlbumController {
    // get album by id
    async getAlbumById(req, res, next) {
        const album = await Album.findById(req.params.id);
        if (!album) {
            return res.status(404).send({ message: 'Album does not exist' });
        }

        res.status(200).send({ data: album, message: 'Get album successfully' });
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

        const newAlbum = await new Album({
            ...req.body,
            owner: req.user._id,
        }).save();

        res.status(200).send({
            data: newAlbum,
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
}

module.exports = new AlbumController();
