const models = require('../models');

module.exports = {
  async createNote(_parent, { input }) {
    const { content, author } = input;
    return await models.Note.create({ content, author });
  }
};
