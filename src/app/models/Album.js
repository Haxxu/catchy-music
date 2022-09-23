const mongoose = require('mongoose');
const { Schema } = require('mongoose');

const albumSchema = new mongoose.Schema(
    {
        owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        name: { type: String },
        description: { type: String },
        image: { type: String },
        tracks: [{ type: Schema.Types.ObjectId, ref: 'Track' }],
        isReleased: { type: Boolean, required: true, default: false },
        releaseDate: { type: Date, default: Date.now },
        saved: { type: Number, default: 0 },
        type: { type: String, required: true },
    },
    { timestamps: true },
);
const Album = mongoose.model('Album', albumSchema);

module.exports = { Album };
