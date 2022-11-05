const moment = require('moment');

const { Track, validateTrack } = require('../models/Track');
const { Album } = require('../models/Album');
const { Library } = require('../models/Library');
const { Playlist } = require('../models/Playlist');
const { Lyric } = require('../models/Lyric');
const { Comment } = require('../models/Comment');
const { User } = require('../models/User');
class TrackController {
    // Get track by id
    async getTrack(req, res, next) {
        const track = await Track.findOne({ _id: req.params.id });
        if (!track) {
            return res.status(400).send({ message: 'Track does not exist' });
        }

        res.status(200).send({ data: track, message: 'Get track successfully' });
    }

    async getTracksInfo(req, res, next) {
        try {
            const totalTracks = await Track.find().count('_id');

            const today = moment().startOf('day');

            const newTracksToday = await Track.find({
                createdAt: {
                    $gte: today.toDate(),
                    $lte: moment(today).endOf('day').toDate(),
                },
            }).count('_id');

            const newTracksThisMonth = await Track.find({
                createdAt: {
                    $gte: moment(today).startOf('month').toDate(),
                    $lte: moment(today).endOf('month').toDate(),
                },
            }).count('_id');

            const newTracksLastMonth = await Track.find({
                createdAt: {
                    $gte: moment(today).subtract(1, 'months').startOf('month').toDate(),
                    $lte: moment(today).subtract(1, 'months').endOf('month').toDate(),
                },
            }).count('_id');

            return res.status(200).send({
                data: { totalTracks, newTracksToday, newTracksThisMonth, newTracksLastMonth },
                message: 'Get tracks info successfuly',
            });
        } catch (error) {
            return res.status(404).send({ message: error });
        }
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
        try {
            const track = await Track.findOne({ _id: req.params.id });

            if (!track) {
                return res.status(400).send({ message: 'Track does not exist' });
            }

            if (req.user._id !== track.owner.toString() && req.user.type !== 'admin') {
                return res.status(403).send({ message: "You don't have permission to perform this action" });
            }

            // Delete track in album
            await Album.updateMany({ owner: track.owner.toString() }, { $pull: { tracks: { track: req.params.id } } });
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
        } catch (error) {
            console.log(error);
            res.status(500).send({ message: 'Something went wrong' });
        }
    }

    async getTracksByContext(req, res, next) {
        try {
            if (!req.query.type) {
                let message = '';
                let searchCondition = {};
                if (req.query.search && req.query.search.trim() !== '') {
                    let search = req.query.search.trim();
                    searchCondition = {
                        $or: [
                            {
                                name: {
                                    $regex: search,
                                    $options: 'i',
                                },
                            },
                            {
                                artists: {
                                    $elemMatch: {
                                        name: {
                                            $regex: search,
                                            $options: 'i',
                                        },
                                    },
                                },
                            },
                        ],
                    };
                }

                const tracks = await Track.find({ ...searchCondition });
                return res.status(200).send({ data: tracks, message: 'Get tracks successfully' });
            } else if (req.query.type && req.query.type === 'album' && req.query.id) {
                const album = await Album.findOne({ _id: req.query.id }).lean();
                if (!album) {
                    return res.status(404).send({ message: 'Album not found' });
                }

                const trackIds = album.tracks.map((track) => track.track);

                const tracks = await Track.find({ _id: { $in: trackIds } });

                return res.status(200).send({ data: tracks, message: 'Get tracks successfully' });
            }
        } catch (error) {
            console.log(error);
            return res.status(500).send({ message: 'Something went wrong' });
        }
    }

    async playTrack(req, res, next) {
        try {
            const track = await Track.findOne({ _id: req.params.id });
            track.plays = track.plays + 1;

            await track.save();
            return res.status(200).send({ message: 'Play track successfully' });
        } catch (error) {
            return res.status(500).send({ message: 'Something went wrong' });
        }
    }
}

module.exports = new TrackController();
