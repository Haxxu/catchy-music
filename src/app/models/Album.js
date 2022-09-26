const mongoose = require('mongoose');
const { Schema } = mongoose;

const albumSchema = new mongoose.Schema(
    {
        owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        name: { type: String, required: true, default: '' },
        description: { type: String, default: '' },
        image: { type: String, default: '' },
        tracks: [{ type: Schema.Types.ObjectId, ref: 'Track' }],
        isReleased: { type: Boolean, required: true, default: false },
        releaseDate: { type: Date, default: Date.now() },
        date: { type: String, required: true },
        month: { type: String, required: true },
        year: { type: String, required: true },
        saved: { type: Number, default: 0 },
        type: { type: String, required: true },
    },
    { timestamps: true },
);
const Album = mongoose.model('Album', albumSchema);

module.exports = { Album };
