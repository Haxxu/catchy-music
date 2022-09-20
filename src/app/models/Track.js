const mongoose = require('mongoose');
const { Schema } = mongoose;

const trackSchema = new Schema({
    owner: { type: Schema.Types.ObjectId },
    name: { type: String, required: true },
    artists: {
        names: { type: [String] },
        ids: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    },
    audio: { type: String, required: true },
    image: { type: String, required: true },
    duration: { type: Number, required: true, default: 0 },
    plays: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },
    lyrics: [{ type: Schema.Types.ObjectId, ref: 'Lyric' }],
});

const Track = mongoose.model('Track', trackSchema);

module.exports = { Track };
