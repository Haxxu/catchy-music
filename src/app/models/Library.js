const mongoose = require('mongoose');
const { Schema } = mongoose;

const librarySchema = new mongoose.Schema(
    {
        owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        likedTracks: [
            {
                track: { type: Schema.Types.ObjectId, ref: 'Track' },
                album: { type: Schema.Types.ObjectId, ref: 'Album' },
                dateAdded: { type: Date, default: Date.now() },
                _id: false,
            },
        ],
        albums: [{ type: Schema.Types.ObjectId, ref: 'Album' }],
        playlists: [{ type: Schema.Types.ObjectId, ref: 'Playlist' }],
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
