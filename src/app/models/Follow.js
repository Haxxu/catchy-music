const mongoose = require('mongoose');
const { Schema } = require('mongoose');

const followSchema = new mongoose.Schema(
    {
        owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        followings: { type: [Schema.Types.ObjectId], default: [] },
        followers: { type: Number, default: 0 },
    },
    { timestamps: true },
);
const Follow = mongoose.model('Follow', followSchema);

module.exports = { Follow };
