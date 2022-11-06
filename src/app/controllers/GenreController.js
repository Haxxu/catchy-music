const { Genre, validateGenre } = require('../models/Genre');
const { Track } = require('../models/Track');
const { User } = require('../models/User');

class GenreController {
    // Get all genres
    async getAllGenres(req, res, next) {
        const genres = await Genre.find();

        res.status(200).send({ data: genres, message: 'Get all genres successfully' });
    }

    // Get genre by id
    async getGenreById(req, res, next) {
        try {
            const genre = await Genre.findOne({ _id: req.params.id });
            if (!genre) {
                return res.status(404).send({ message: 'Genre not found' });
            }

            return res.status(200).send({ data: genre, message: 'Get genre successfully' });
        } catch (error) {
            return res.status(500).send({ message: 'Something went wrong' });
        }
    }

    // create new genre
    async createGenre(req, res, next) {
        const { error } = validateGenre(req.body);
        if (error) {
            return res.status(400).send({ message: error.details[0].message });
        }

        const genre = await new Genre({
            ...req.body,
        }).save();

        res.status(200).send({ data: genre, message: 'Genre created successully' });
    }

    // update genre by id
    async updateGenre(req, res, next) {
        const { error } = validateGenre(req.body);
        if (error) {
            return res.status(400).send({ message: error.details[0].message });
        }

        const genre = await Genre.findById(req.params.id);
        if (!genre) {
            return res.status(404).send({ message: 'Genre does not exist' });
        }

        const updatedGenre = await Genre.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });

        res.status(200).send({ data: updatedGenre, message: 'Genre updated successfully' });
    }

    // delete genre by id
    async deleteGenre(req, res, next) {
        try {
            const genre = await Genre.findOne({ _id: req.params.id });
            if (!genre) {
                return res.status(404).send({ messaeg: 'Genre not found' });
            }

            await User.updateMany({}, { $pull: { genres: req.params.id } });

            await Track.updateMany({}, { $pull: { genres: req.param.id } });

            await Genre.findOneAndRemove({ _id: req.params.id });

            return res.status(200).send({ message: 'Deleted genre successfully' });
        } catch (error) {
            return res.status(500).send({ message: 'Something went wrong' });
        }
    }
}

module.exports = new GenreController();
