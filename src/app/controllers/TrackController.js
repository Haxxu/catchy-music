const { Track, validateTrack } = require('../models/Track');
const { Album } = require('../models/Album');
const { Library } = require('../models/Library');
const { Playlist } = require('../models/Playlist');
const { Lyric } = require('../models/Lyric');
const { Comment } = require('../models/Comment');
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

        const newTrack = await new Track({
            ...req.body,
            owner: req.user._id,
        }).save();

        res.status(200).send({ data: newTrack, message: 'Track created successfully!' });
    }

    // Update track
    async updateTrack(req, res, next) {
        const { error } = validateTrack(req.body);
        if (error) {
            return res.status(400).send({ message: error.details[0].message });
        }

        const track = await Track.findOne({ _id: req.params.id });
        if (!track) {
            return res.status(400).send({ message: 'Track does not exist' });
        }

        if (req.user._id !== track.owner.toString()) {
            return res.status(403).send({ message: "You don't have permission to perform this action" });
        }

        let updatedTrack = await Track.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });

        res.status(200).send({ data: updatedTrack, message: 'Track updated successfully' });
    }

    // Remove track
    async deleteTrack(req, res, next) {
        const track = await Track.findOne({ _id: req.params.id });

        if (!track) {
            return res.status(400).send({ message: 'Track does not exist' });
        }

        if (req.user._id !== track.owner.toString()) {
            return res.status(403).send({ message: "You don't have permission to perform this action" });
        }

        // Delete track in album
        await Album.updateMany({ owner: req.user._id }, { $pull: { tracks: { track: req.param.id } } });
        // Delete track in playlist
        await Playlist.updateMany({}, { $pull: { tracks: { track: req.params.id } } });
        // Delete track in likedTrack (Library)
        await Library.updateMany({}, { $pull: { likedTracks: { track: req.params.id } } });
        // Delete lyric of track
        await Lyric.deleteMany({ track: req.params.id });
        // Delete comment of track
        await Comment.deleteMany({ track: req.params.id });
        //Delete track
        await Track.findOneAndRemove({ _id: req.params.id });

        res.status(200).send({ message: 'Delete track successfully' });
    }
}

module.exports = new TrackController();
