module.exports = {
  async notes(_, _args, { models }) {
    return await models.Note.find();
  },

  async noteFeed(_, { cursor }, { models }) {
    const limit = 10;
    let hasNextPage = false;
    let cursorQuery = {};

    if (cursor) {
      cursorQuery = { _id: { $lt: cursor } };
    }

    let notes = await models.Note.find(cursorQuery)
      .sort({ _id: -1 })
      .limit(limit + 1);

    if (notes.length > limit) {
      hasNextPage = true;
      notes = notes.slice(0, -1);
    }
    const newCursor = notes[notes.length - 1]._id;

    return {
      notes,
      cursor: newCursor,
      hasNextPage
    };
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
