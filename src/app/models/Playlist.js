const mongoose = require('mongoose');
const { Schema } = require('mongoose');

const playlistSchema = new mongoose.Schema(
    {
        owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        name: { type: String },
        description: { type: String },
        tracks: [{ type: Schema.Types.ObjectId, ref: 'Track' }],
        image: { type: String },
        isPublic: { type: Boolean, required: true, default: false },
        saved: { type: Number, default: 0 },
    },
    { timestamps: true },
);
const Playlist = mongoose.model('Playlist', playlistSchema);

module.exports = { Playlist };
