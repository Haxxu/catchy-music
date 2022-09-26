const mongoose = require('mongoose');
const { Schema } = mongoose;

const lyricSchema = new Schema(
    {
        onwer: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        track: { type: Schema.Types.ObjectId, ref: 'Track', required: true },
        content: { type: String, required: true },
        nation: { type: String, required: true },
        providedBy: { type: String, default: 'N/A' },
    },
    { timestamps: true },
);

const Lyric = mongoose.model('Lyric', lyricSchema);

module.exports = { Lyric };
