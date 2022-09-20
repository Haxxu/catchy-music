const bcrypt = require('bcrypt');

const { User, validateUser } = require('../models/User');
const { Library } = require('../models/Library');
const { Follow } = require('../models/Follow');

class UserController {
    // [GET] /
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

        let follow = await new Follow({
            owner: newUser._id,
        }).save();

        newUser.password = undefined;
        newUser.__v = undefined;

        res.status(200).send({ data: newUser, message: 'Account created successfully!' });
    }
}

module.exports = new UserController();
