module.exports = {
  async notes(_, _args, { models }) {
    return await models.Note.find();
  },

  async note(_, { id }, { models }) {
    return await models.Note.findById(id);
  },

  async users(_, _args, { models }) {
    return await models.User.find({});
  },

  async user(_, { username }, { models }) {
    return await models.User.findOne({ username });
  },

  async me(_, _args, { models, user }) {
    return await models.User.findById(user.id);
  }
};
