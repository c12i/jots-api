module.exports = {
  async createNote(_, { input }, { models }) {
    const { content, author } = input;
    return await models.Note.create({ content, author });
  },
  async updateNote(_, { id, content }, { models }) {
    return await models.Note.findOneAndUpdate(
      { _id: id },
      { $set: { content } },
      { new: true }
    );
  },
  async deleteNote(_, { id }, { models }) {
    try {
      await models.Note.findOneAndRemove({ _id: id });
      return true;
    } catch (_) {
      return false;
    }
  }
};
