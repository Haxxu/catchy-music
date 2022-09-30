const Joi = require('joi');
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
                album: { type: Schema.Types.ObjectId, ref: 'Album' },
                dateAdded: { type: Date, default: Date.now() },
                _id: false,
            },
        ],
        image: { type: String, default: '' },
        isPublic: { type: Boolean, default: false },
        saved: { type: Number, default: 0 },
    },
    { timestamps: true },
);

const validatePlaylist = (playlist) => {
    const schema = Joi.object({
        name: Joi.string().required(),
        description: Joi.string(),
        image: Joi.string(),
    });

    return schema.validate(playlist);
};

const Playlist = mongoose.model('Playlist', playlistSchema);

module.exports = { Playlist, validatePlaylist };
