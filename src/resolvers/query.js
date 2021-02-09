module.exports = {
  async notes(_parent, _args, { models }) {
    return await models.Note.find();
  },
  async note(_parent, { id }, { models }) {
    return await models.Note.findById(id);
  }
};
