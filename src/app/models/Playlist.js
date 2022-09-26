const mongoose = require('mongoose');
const { Schema } = mongoose;

const playlistSchema = new mongoose.Schema(
    {
        owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        name: { type: String, default: '' },
        description: { type: String, default: '' },
        tracks: [
            {
                track: { type: Schema.Types.ObjectId, ref: 'Track' },
                ablum: { type: Schema.Types.ObjectId, ref: 'Album' },
                dateAdded: { type: Date, default: Date.now() },
            },
        ],
        image: { type: String, default: '' },
        isPublic: { type: Boolean, required: true, default: false },
        saved: { type: Number, default: 0 },
    },
    { timestamps: true },
);
const Playlist = mongoose.model('Playlist', playlistSchema);

module.exports = { Playlist };
