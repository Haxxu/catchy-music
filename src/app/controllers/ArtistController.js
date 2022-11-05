const { Library } = require('../models/Library');
const { User } = require('../models/User');
const { Genre } = require('../models/Genre');
const { Track } = require('../models/Track');
const { Album } = require('../models/Album');

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

    // Get artist info (for admin)
    async getArtistsInfo(req, res, next) {
        try {
            const totalArtists = await User.find({ type: 'artist' }).count('_id');

            return res.status(200).send({ data: { totalArtists }, message: 'Get artist info successfully' });
        } catch (error) {
            return res.status(500).send({ message: 'Something went wrong' });
        }
    }

    // Get artist by context (admin)
    async getArtistsByContext(req, res, next) {
        try {
            let message = '';
            let searchCondition = {};
            if (req.query.search && req.query.search.trim() !== '') {
                let search = req.query.search.trim();

                const tracks = await Track.find({ name: { $regex: search, $options: 'i' } }).select('owner');
                const albums = await Album.find({ name: { $regex: search, $options: 'i' } }).select('owner');

                let artistIdsList = tracks.map((track) => track.owner.toString());
                artistIdsList = artistIdsList.concat(albums.map((album) => album.owner.toString()));

                searchCondition = {
                    $or: [
                        {
                            name: {
                                $regex: search,
                                $options: 'i',
                            },
                        },
                        {
                            email: {
                                $regex: search,
                                $options: 'i',
                            },
                        },
                        {
                            _id: { $in: artistIdsList },
                        },
                    ],
                };
            }

            const users = await User.find({ ...searchCondition, type: 'artist' })
                .select('-password -__v')
                .lean();

            let length = users.length;
            for (let i = 0; i < length; ++i) {
                let id = users[i]._id;
                const library = await Library.findOne({ owner: id });
                users[i].totalFollowers = library.followers.length;
                users[i].totalTracks = await Track.find({ owner: id }).count();
                users[i].totalAlbums = await Album.find({ owner: id }).count();
            }

            return res.status(200).send({ data: users, message });
        } catch (error) {
            return res.status(500).send({ message: 'Something went wrong' });
        }
    }
}

module.exports = new ArtistController();
