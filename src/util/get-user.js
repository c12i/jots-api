const jwt = require('jsonwebtoken')
const { logger } = require('./logger')

module.exports = function(token) {
    if (token) {
        try {
            return jwt.verify(token, process.env.JWT_SECRET)
        } catch (error) {
            logger.error(`Error: ${error.message}`)
            throw new Error('Invalid session')
        }
    }
}
