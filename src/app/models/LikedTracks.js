const mongoose = require('mongoose');
const { Schema } = require('mongoose');

const likedTracksSchema = new mongoose.Schema(
    {
        tracks: [{ type: String }],
    },
    { timestamps: true },
);
const LikedTracks = mongoose.model('likedTracks', likedTracksSchema);

module.exports = { LikedTracks };
