const mongoose = require('mongoose');
const { Schema } = mongoose;

const trackSchema = new Schema(
    {
        owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        name: { type: String, required: true },
        artists: [
            {
                name: { type: String },
                id: { type: Schema.Types.ObjectId, ref: 'User' },
            },
        ],
        audio: { type: String, required: true },
        image: { type: String, required: true },
        duration: { type: Number, required: true, default: 0 },
        genres: [{ type: Schema.Types.ObjectId, ref: 'Genre' }],
        plays: { type: Number, default: 0 },
        saved: { type: Number, default: 0 },
        lyrics: [{ type: Schema.Types.ObjectId, ref: 'Lyric' }],
        releaseDate: { type: Date, default: Date.now() },
    },
    { timestamps: true },
);

const Track = mongoose.model('Track', trackSchema);

module.exports = { Track };
