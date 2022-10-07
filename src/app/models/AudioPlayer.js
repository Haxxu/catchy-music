const Joi = require('joi');
const mongoose = require('mongoose');
const { Schema } = mongoose;

const audioPlayerSchema = new mongoose.Schema(
    {
        owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        currentPlayingTrack: {
            track: { type: String, default: '' },
            album: { type: String, default: '' },
            position: { type: Number, default: 0 },
        },
        state: { type: String, default: 'pause' },
        queue: {
            tracks: [
                {
                    track: { type: String, required: true },
                    album: { type: String, required: true },
                    addedAt: { type: Date, default: Date.now() },
                    order: { type: Number },
                    _id: false,
                },
            ],
            currentTrackWhenQueueActive: {
                track: { type: String, default: '' },
                album: { type: String, default: '' },
                position: { type: Number, default: 0 },
                type: Object,
                default: null,
            },
        },

        tracks: [
            {
                track: { type: String, required: true },
                album: { type: String, required: true },
                addedAt: { type: Date, default: Date.now() },
                _id: false,
            },
        ],
        shuffleTracks: [
            {
                track: { type: String, required: true },
                album: { type: String, required: true },
                addedAt: { type: Date, default: Date.now() },
                _id: false,
            },
        ],
        context: {
            type: { type: String, defaut: '' },
            currentPlaylist: { type: String, default: '' },
            currentAlbum: { type: String, default: '' },
            currentLiked: { type: String, default: '' },
            currentArtist: { type: String, default: '' },
        },
        repeat: {
            type: String,
            default: 'none',
        },
        shuffle: {
            type: String,
            default: 'none',
        },
        volume: {
            type: Number,
            default: 50,
            min: 0,
            max: 100,
        },
    },
    { timestamps: true },
);

const AudioPlayer = mongoose.model('AudioPlayer', audioPlayerSchema);

module.exports = { AudioPlayer };
