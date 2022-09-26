const { Track, validateTrack } = require('../models/Track');

class TrackController {
    // Get track by id
    async getTrack(req, res, next) {
        const track = await Track.findOne({ _id: req.params.id });
        if (!track) {
            return res.status(400).send({ message: 'Track does not exist' });
        }

        res.status(200).send({ data: track, message: 'Get track successfully' });
    }

    // Create new track
    async createTrack(req, res, next) {
        const { error } = validateTrack(req.body);
        if (error) {
            return res.status(400).send({ message: error.details[0].message });
        }

        let newTrack = await new Track({
            ...req.body,
            owner: req.user._id,
        }).save();

        res.status(200).send({ data: newTrack, message: 'Track created successfully!' });
    }

    // Update track
    async updateTrack(req, res, next) {
        const track = await Track.findOne({ _id: req.params.id });

        if (!track) {
            return res.status(400).send({ message: 'Track does not exist' });
        }

        if (req.user._id !== track.owner.toString()) {
            return res.status(403).send({ message: "You don't have permission to perform this action" });
        }

        const { error } = validateTrack(req.body);
        if (error) {
            return res.status(400).send({ message: error.details[0].message });
        }

        let updatedTrack = await Track.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });

        res.status(200).send({ data: updatedTrack, message: 'Track updated successfully' });
    }

    // Update track
    async removeTrack(req, res, next) {
        const track = await Track.findOne({ _id: req.params.id });

        if (!track) {
            return res.status(400).send({ message: 'Track does not exist' });
        }

        if (req.user._id !== track.owner.toString()) {
            return res.status(403).send({ message: "You don't have permission to perform this action" });
        }

        await Track.findOneAndRemove({ _id: req.params.id });

        res.status(200).send({ message: 'Remove track successfully' });
    }
}

module.exports = new TrackController();
