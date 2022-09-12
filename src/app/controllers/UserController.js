class UserController {
    // [GET] /
    async getAllUsers(req, res, next) {
        await res.json({ message: 'Get all users' });
    }
}

module.exports = new UserController();
