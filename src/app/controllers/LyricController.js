const mongoose = require('mongoose');

const { Lyric, validateLyric } = require('../models/Lyric');
const { Track } = require('../models/Track');

class LyricController {
    async addLyricToTrack(req, res, next) {
        const { error } = validateLyric(req.body);
        if (error) {
            return res.status(400).send({ message: error.details[0].message });
        }

        if (!mongoose.isValidObjectId(req.body.track)) {
            return res.status(404).send({ message: 'Invalid ID.' });
        }
        const track = await Track.findOne({ _id: req.body.track });
        if (!track) {
            return res.status(400).send({ message: 'Track does not exist' });
        } else {
            if (track.owner.toString() !== req.user._id) {
                return res.status(400).send({ message: "You don't have permission to add lyric to this track" });
            }
        }

        const newLyric = await new Lyric({
            ...req.body,
            owner: req.user._id,
        }).save();

        res.status(200).send({ data: newLyric, message: 'Added lyric to track successfully' });
    }

    async updateLyric(req, res, next) {
        const { error } = validateLyric(req.body);
        if (error) {
            return res.status(400).send({ message: error.details[0].message });
        }

        if (!mongoose.isValidObjectId(req.body.track)) {
            return res.status(404).send({ message: 'Invalid ID.' });
        }
        const track = await Track.findOne({ _id: req.body.track });
        if (!track) {
            return res.status(400).send({ message: 'Track does not exist' });
        } else {
            if (track.owner.toString() !== req.user._id) {
                return res.status(400).send({ message: "You don't have permission to update lyric to this track" });
            }
        }

        let updatedLyric = await Lyric.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });

        res.status(200).send({ data: updatedLyric, message: 'Updated lyric successfully' });
    }

    async getAllLyricsOfTrack(req, res, next) {
        const lyrics = await Lyric.find({ track: req.params.id });

        res.status(200).send({ data: lyrics, message: 'Get lyric successfully' });
    }

    // remove lyric by id
    async removeLyric(req, res, next) {
        const lyric = await Lyric.findById(req.params.id); //lyric_id
        if (!lyric) {
            return res.status(400).send({ message: 'Lyric does not exist' });
        }

        if (lyric.owner.toString() !== req.user._id) {
            return res.status(400).send({ message: "You don't have permision to remove this lyric" });
        }

        await Lyric.findOneAndRemove({ _id: req.params.id });

        res.status(200).send({ message: 'Remove lyric successfully' });
    }
}

module.exports = new LyricController();
