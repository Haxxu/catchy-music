const mongoose = require('mongoose');
const { Schema } = mongoose;

const genreSchema = new Schema(
    {
        name: { type: String, required: true },
        description: { type: String, default: '' },
        image: { type: String, default: '' },
    },
    { timestamps: true },
);

const Genre = mongoose.model('Genre', genreSchema);

module.exports = { Genre };
