const jwt = require('jsonwebtoken');

module.exports = function(token) {
  if (token) {
    try {
      return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      throw new Error('Invalid session');
    }
  }
};
