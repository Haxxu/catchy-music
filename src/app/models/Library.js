const mongoose = require('mongoose');
const { Schema } = mongoose;

const librarySchema = new mongoose.Schema(
    {
        owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        likedTracks: [
            {
                track: { type: String, required: true },
                album: { type: String, required: true },
                dateAdded: { type: Date, default: Date.now() },
                _id: false,
            },
        ],
        albums: [String],
        playlists: [String],
        following: {
            items: [{ type: String }],
            total: { type: Number, default: 0 },
        },
        follower: {
            items: [{ type: String }],
            total: { type: Number, default: 0 },
        },
    },
    { timestamps: true },
);

const Library = mongoose.model('Library', librarySchema);

module.exports = { Library };
