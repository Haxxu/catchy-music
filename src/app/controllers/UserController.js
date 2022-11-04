const bcrypt = require('bcrypt');
const moment = require('moment');

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
        if (user.type === 'admin') user.type = 'user';

        res.status(200).send({ data: user, message: 'Get user successfully' });
    }

    // Get user info
    async getUsersInfo(req, res, next) {
        try {
            const totalUsers = await User.count('_id');

            const today = moment().startOf('day');

            const newUsersToday = await User.find({
                createdAt: {
                    $gte: today.toDate(),
                    $lte: moment(today).endOf('day').toDate(),
                },
            }).count('_id');

            const newUsersThisMonth = await User.find({
                createdAt: {
                    $gte: moment(today).startOf('month').toDate(),
                    $lte: moment(today).endOf('month').toDate(),
                },
            }).count('_id');

            const newUsersLastMonth = await User.find({
                createdAt: {
                    $gte: moment(today).subtract(1, 'months').startOf('month').toDate(),
                    $lte: moment(today).subtract(1, 'months').endOf('month').toDate(),
                },
            }).count('_id');

            return res.status(200).send({
                data: { totalUsers, newUsersToday, newUsersThisMonth, newUsersLastMonth },
                message: 'Get user info successfuly',
            });
        } catch (error) {
            return res.status(500).send({ message: 'Something went wrong' });
        }
    }

    // get users by context
    async getUsersByContext(req, res, next) {
        try {
            let message = '';
            let searchCondition = {};
            if (req.query.search && req.query.search.trim() !== '') {
                let search = req.query.search.trim();
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
                    ],
                };
            }
            if (req.query.type) {
                if (req.query.type === 'artist') {
                    searchCondition.type = 'artist';
                    message = 'Get artists successfully';
                } else if (req.query.type === 'user') {
                    searchCondition.type = 'user';
                    message = 'Get users successfully';
                }
            } else {
                searchCondition.type = { $ne: 'admin' };
                message = 'Get users successfully';
            }

            const users = await User.find({ ...searchCondition }).select('-password -__v');

            return res.status(200).send({ data: users, message });
        } catch (error) {
            return res.status(500).send({ message: 'Something went wrong' });
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
        await User.findByIdAndUpdate(req.params.id, { password: password, status: 'freezed' });

        res.status(200).send({ message: 'Freeze user successfully' });
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
        await User.findByIdAndUpdate(req.params.id, { password: password, status: 'actived' });

        res.status(200).send({ message: 'Unfreeze user successfully' });
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
