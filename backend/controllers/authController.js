const User = require('../models/userModel');
const { encryptPassword, comparePassword } = require('../utils/passwordUtils');
const jwt = require('jsonwebtoken');

// Signup
exports.signup = async (req, res) => {
    const { username, email, password, phone } = req.body;

    if (!username || !email || !password || !phone) {
        return res.status(400).json({ msg: 'Please provide all required fields' });
    }

    User.findByEmail(email, async (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        if (result.length > 0) return res.status(400).json({ msg: 'User already exists' });

        const hashedPassword = await encryptPassword(password);
        const newUser = { username, email, password: hashedPassword, phone };

        User.createUser(newUser, (err, result) => {
            if (err) return res.status(500).json({ error: err.message });

            res.json({
                id: result.insertId,
                username: newUser.username,
                email: newUser.email,
                phone: newUser.phone
            });
        });
    });
};

// Login
exports.login = (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ msg: 'Please provide both username and password' });
    }

    User.findByUsername(username, async (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        if (result.length === 0) return res.status(400).json({ msg: 'Invalid credentials' });

        const user = result[0];
        const isMatch = await comparePassword(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '30d' });
        res.json({ username: user.username, token });
    });
};
