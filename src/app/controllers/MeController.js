const { User } = require('../models/User');

class MeController {
    // Get current user profile
    async getCurrentUserProfile(req, res, next) {
        const user = await User.findOne({ _id: req.user._id }).select('-password -__v');

        res.status(200).send({ data: user, message: 'Get user profile successfully' });
    }
}

module.exports = new MeController();
