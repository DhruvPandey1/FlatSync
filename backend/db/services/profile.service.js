const db = require('../db');

const getUserProfileService = async (userId) => {
    return await db.query('SELECT * from users WHERE id=$1', [userId]);
};

const updateUserProfileService = async (full_name, email, hashedPassword, userId) => {
    if (hashedPassword) {
        return await db.query(
            'UPDATE users SET full_name =$1,email =$2,password_hash =$3 WHERE id=$4',
            [full_name, email, hashedPassword, userId]
        );
    } else {
        return await db.query(
            'UPDATE users SET full_name =$1,email =$2 WHERE id=$3',
            [full_name, email, userId]
        );
    }
};

module.exports = {
    getUserProfileService,
    updateUserProfileService
};
