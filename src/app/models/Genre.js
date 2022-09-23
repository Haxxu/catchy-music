const mongoose = require('mongoose');
const { Schema } = mongoose;

const genreSchema = new Schema(
    {
        name: { type: String, required: true },
        description: { type: String },
        image: { type: String },
    },
    { timestamps: true },
);

const Genre = mongoose.model('Genre', genreSchema);

module.exports = { Genre };
