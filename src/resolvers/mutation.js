const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {
  ForbiddenError,
  AuthenticationError
} = require('apollo-server-express');

const gravatar = require('../util/gravatar');

module.exports = {
  async signUp(_, { input }, { models }) {
    let { email, username, password } = input;
    email = email.trim().toLowerCase();
    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(password, salt);
    const avatar = gravatar(email);
    try {
      const user = await models.User.create({
        username,
        email,
        salt,
        avatar,
        password: hash
      });
      return jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    } catch (error) {
      console.error(error);
      throw new Error('Error signing up');
    }
  },

  async signIn(_, { input }, { models }) {
    let { username, email, password } = input;
    if (email) {
      email = email.trim().toLowerCase();
    }
    const user = await models.User.findOne({ $or: [{ email }, { username }] });
    if (!user) throw new AuthenticationError('Error Signing In');

    const predicate = await bcrypt.hash(password, user.salt);
    const valid = predicate === user.password;

    if (!valid) {
      throw new AuthenticationError('Error Signing In');
    }

    return jwt.sign({ id: user._id }, process.env.JWT_SECRET);
  },

  async createNote(_, { content }, { models }) {
    return await models.Note.create({ content, author: 'Anon' });
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
