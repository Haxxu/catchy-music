const { Genre, validateGenre } = require('../models/Genre');

class GenreController {
    // Get all genres
    async getAllGenres(req, res, next) {
        const genres = await Genre.find();

        res.status(200).send({ data: genres, message: 'Get all genres successfully' });
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
}

module.exports = new GenreController();
