const db = require('../config/db');

const User = {
    findByEmail: (email, callback) => {
        db.query('SELECT * FROM users WHERE email = ?', [email], callback);
    },

    findByUsername: (username, callback) => {
        db.query('SELECT * FROM users WHERE username = ?', [username], callback);
    },

    createUser: (user, callback) => {
        db.query('INSERT INTO users SET ?', user, callback);
    }
};

module.exports = User;
