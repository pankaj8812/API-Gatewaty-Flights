const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { ServerConfig } = require('../../config');
const serverConfig = require('../../config/server-config');
function checkPassword(plainPassword, encryptedPassword) {
    try {
        return bcrypt.compareSync(plainPassword, encryptedPassword);
    } catch(error) {
        console.log(error);
        throw error;
    }
}

function createToken(input) {
    try {
        console.log(serverConfig.JWT_EXPIRY, typeof(ServerConfig.JWT_EXPIRY));
        return jwt.sign(input, ServerConfig.JWT_SECRET, {expiresIn: ServerConfig.JWT_EXPIRY});
    } catch(error) {
        console.log(error);
        throw error;
    }
}

module.exports = {
    checkPassword,
    createToken
}