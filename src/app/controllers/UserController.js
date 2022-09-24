const bcrypt = require('bcrypt');

const { User, validateUser } = require('../models/User');
const { Library } = require('../models/Library');

class UserController {
    // get all users
    async getAllUsers(req, res, next) {
        await res.json({ message: 'Get all users' });
    }

    // Create user
    async createUser(req, res, next) {
        const { error } = validateUser(req.body);
        if (error) {
            return res.status(400).send({ message: error.details[0].message });
        }

        const user = await User.findOne({ email: req.body.email });
        if (user) {
            return res.status(403).send({ message: 'User with given email already exists!' });
        }

        const salt = await bcrypt.genSalt(Number(process.env.SALT));
        const hashPassword = await bcrypt.hash(req.body.password, salt);
        delete req.body.confirm_password;

        let newUser = await new User({
            ...req.body,
            password: hashPassword,
        }).save();

        let library = await new Library({
            owner: newUser._id,
        }).save();

        newUser.password = undefined;
        newUser.__v = undefined;

        res.status(200).send({ data: newUser, message: 'Account created successfully!' });
    }

    // Verify artist
    async verifyArtist(req, res, next) {
        const user = await User.findById(req.params.id); //user_id
        if (!user) {
            return res.status(400).send({ message: 'User does not exist' });
        }

        await user.updateOne({ type: 'artist' });

        res.status(200).send({ message: 'Verify artist successfullly' });
    }

    // Unverify artist
    async unverifyArtist(req, res, next) {
        const user = await User.findById(req.params.id); //user_id
        if (!user) {
            return res.status(400).send({ message: 'User does not exist' });
        }

        await user.updateOne({ type: 'user' });

        res.status(200).send({ message: 'Unverify artist successfullly' });
    }
}

module.exports = new UserController();
