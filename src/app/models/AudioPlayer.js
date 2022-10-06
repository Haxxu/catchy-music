const { string } = require('joi');
const Joi = require('joi');
const mongoose = require('mongoose');
const { Schema } = mongoose;

const audioPlayerSchema = new mongoose.Schema(
    {
        owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        currentPlayingTrack: {
            track: { type: String, required: true },
            album: { type: String, required: true },
        },
        description: { type: String, default: '' },
        queue: [
            {
                track: { type: String, required: true },
                album: { type: String, required: true },
                addedAt: { type: Date, default: Date.now() },
                _id: false,
            },
        ],
        tracks: [
            {
                track: { type: String, required: true },
                album: { type: String, required: true },
                addedAt: { type: Date, default: Date.now() },
                _id: false,
            },
        ],
        context: {
            type: { type: String },
            currentPlaylist: { type: String },
            currentAlbum: { type: String },
            currentLiked: { type: String },
            currentArtist: { type: String },
        },
        isRepeat: {
            type: Boolean,
            required: true,
            default: false,
        },
        isShuffle: {
            type: Boolean,
            required: true,
            default: false,
        },
        volume: {
            type: Number,
            required: true,
            default: 50,
            min: 0,
            max: 100,
        },
    },
    { timestamps: true },
);

const AudioPlayer = mongoose.model('AudioPlayer', audioPlayerSchema);

module.exports = { AudioPlayer };
