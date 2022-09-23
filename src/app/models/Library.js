const mongoose = require('mongoose');
const { Schema } = require('mongoose');

const librarySchema = new mongoose.Schema(
    {
        owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        likedTracks: { type: [String], default: [] },
        albums: { type: [String], default: [] },
        playlists: { type: [String], default: [] },
        following: {
            items: [{ type: Schema.Types.ObjectId, ref: 'User' }],
            total: { type: Number, default: 0 },
        },
        follower: {
            items: [{ type: Schema.Types.ObjectId, ref: 'User' }],
            total: { type: Number, default: 0 },
        },
    },
    { timestamps: true },
);
const Library = mongoose.model('Library', librarySchema);

module.exports = { Library };
