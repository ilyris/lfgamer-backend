const jwt = require("jsonwebtoken")
const { JWT_SECRET } = require("../config.js")

function generateToken(userData) {

    const payload = {
        user_id: userData.user_id,
        emailAddr: userData.email, 
        username: userData.username
    }
    const options = {
        expiresIn: "24h"
    }
    return jwt.sign(payload, JWT_SECRET, options)
}

module.exports = {
    generateToken
}