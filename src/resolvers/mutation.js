module.exports = {
  async createNote(_parent, { input }, { models }) {
    const { content, author } = input;
    return await models.Note.create({ content, author });
  }
};
