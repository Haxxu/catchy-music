const { Library } = require('../models/Library');
const { User } = require('../models/User');
const { Genre } = require('../models/Genre');

class ArtistController {
    async getArtistById(req, res, next) {
        const artist = await User.findOne({ _id: req.params.id }).select('_id name description type genres').lean();
        if (!artist || artist.type !== 'artist') {
            return res.status(404).send({ message: 'Artist not found' });
        }

        const library = await Library.findOne({ owner: artist._id });
        if (!library) {
            return res.status(404).send({ message: 'Library not found' });
        }

        const detailGenres = [];
        for (let genre of artist.genres) {
            const g = await Genre.findOne({ _id: genre });
            detailGenres.push({
                _id: genre,
                name: g.name,
                description: g.description,
            });
        }

        const artistDetail = {
            ...artist,
            followers: { total: library.followers.length },
            genres: detailGenres,
        };

        res.status(200).send({ data: artistDetail, message: 'Get artist successfully' });
    }
}

module.exports = new ArtistController();
