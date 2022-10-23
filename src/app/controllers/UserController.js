const bcrypt = require('bcrypt');

const { User, validateUser, validateUpdatedPassword } = require('../models/User');
const { Library } = require('../models/Library');
const { Playlist } = require('../models/Playlist');
const { Album } = require('../models/Album');
const { AudioPlayer } = require('../models/AudioPlayer');

class UserController {
    // Get user by id
    async getUser(req, res, next) {
        const user = await User.findOne({ _id: req.params.id });
        if (!user) {
            return res.status(400).send({ message: 'User does not exist' });
        }

        user.password = undefined;
        user.__v = undefined;
        user.updatedAt = undefined;
        if (user.type === 'admin') user.type = 'user';

        res.status(200).send({ data: user, message: 'Get user successfully' });
    }

    // get users by context
    async getUsersByContext(req, res, next) {
        if (req.query.type) {
            if (req.query.type === 'artist') {
                const users = await User.find({ type: 'artist' }).select(['-password', '-__v']);
                return res.status(200).send({ data: users, message: 'Get artist successfully' });
            } else if (req.query.type === 'user') {
                const users = await User.find({ type: 'user' }).select(['-password', '-__v']);
                return res.status(200).send({ data: users, message: 'Get user successfully' });
            }
        } else {
            const users = await User.find({ type: { $ne: 'admin' } }).select(['-password', '-__v']);
            res.status(400).send({ data: users, message: 'Get user ' });
        }
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

        let audioPlayer = await new AudioPlayer({
            owner: newUser._id,
        }).save();

        newUser.password = undefined;
        newUser.__v = undefined;

        res.status(200).send({ data: newUser, message: 'Account created successfully!' });
    }

    // Update user by id
    async updateUser(req, res, next) {
        if (req.user._id !== req.params.id) {
            return res.status(403).send({ message: "User don't have permisson to perform this action" });
        }

        delete req.body.email;

        const user = await User.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true }).select(
            '-password -__v',
        );
        res.status(200).send({ data: user, message: 'Profile updated successfully' });
    }

    // remove user by id
    async removeUser(req, res, next) {
        const user = await User.findById(req.params.id); //user_id
        if (!user) {
            return res.status(400).send({ message: 'User does not exist' });
        }

        await User.findOneAndRemove({ _id: req.params.id });

        res.status(200).send({ message: 'Remove user successfully' });
    }

    // breeze user by id
    async freezeUser(req, res, next) {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(400).send({ message: 'User does not exist' });
        }

        let password = user.password;

        if (password[0] !== '!') {
            password = '!' + password;
        }
        await User.findByIdAndUpdate(req.params.id, { password: password });

        res.status(400).send({ message: 'Freeze user successfully' });
    }

    // unbreeze user by id
    async unfreezeUser(req, res, next) {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(400).send({ message: 'User does not exist' });
        }

        let password = user.password;

        if (password[0] === '!') {
            password = password.slice(1);
        }
        await User.findByIdAndUpdate(req.params.id, { password: password });

        res.status(400).send({ message: 'Unfreeze user successfully' });
    }

    // Update password
    async updatePassword(req, res, next) {
        const { error } = validateUpdatedPassword(req.body);
        if (error) {
            return res.status(400).send({ message: error.details[0].message });
        }

        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res.status(400).send({ message: 'Invalid email or password' });
        }

        const validPassword = await bcrypt.compare(req.body.password, user.password);
        if (!validPassword) {
            return res.status(400).send({ message: 'Invalid email or password' });
        }

        const salt = await bcrypt.genSalt(Number(process.env.SALT));
        const hashNewPassword = await bcrypt.hash(req.body.newPassword, salt);

        await User.findOneAndUpdate({ email: req.body.email }, { password: hashNewPassword });

        res.status(200).send({ message: 'Changed password successfully' });
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
