const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const {
  ForbiddenError,
  AuthenticationError
} = require('apollo-server-express');

const gravatar = require('../util/gravatar');

module.exports = {
  async signUp(_, { input }, { models, logger }) {
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
      logger.error(`Error signing up: ${error.message}`, error.stack);
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

  async createNote(_, { content }, { models, user }) {
    if (!user) {
      throw new AuthenticationError(
        'You must be authenticated to create a note'
      );
    }
    return await models.Note.create({
      content,
      author: mongoose.Types.ObjectId(user.id)
    });
  },

  async updateNote(_, { id, content }, { models, user, logger }) {
    if (!user) {
      throw new AuthenticationError(
        'You must be authenticated to create a note'
      );
    }
    try {
      const note = await models.Note.findById(id);
      if (note && String(note.author) !== user.id) {
        throw new ForbiddenError(
          "You don't have permissions to update this note"
        );
      }
      return await models.Note.findOneAndUpdate(
        { _id: id },
        { $set: { content } },
        { new: true }
      );
    } catch (error) {
      logger.error(`Error updating note: ${error.message}`);
      throw new Error(error.message);
    }
  },

  async deleteNote(_, { id }, { models, logger, user }) {
    if (!user)
      throw new AuthenticationError(
        'You must be authenticated to create a note'
      );
    try {
      const note = await models.Note.findById(id);
      if (note && String(note.author) !== user.id) {
        throw new ForbiddenError(
          "You don't have permissions to delete this note"
        );
      }
      await note.remove();
      return true;
    } catch (error) {
      logger.error(`Error deleting note: ${error.message}`, error.stack);
      return false;
    }
  },

  async toggleFavorite(_, { id }, { models, user, pubsub }) {
    if (!user) {
      throw new AuthenticationError();
    }

    let noteCheck = await models.Note.findById(id);
    const hasUser = noteCheck.favoritedBy.includes(user.id);

    // User had previously favorited post
    if (hasUser) {
      const note = await models.Note.findByIdAndUpdate(
        id,
        {
          $pull: {
            favoritedBy: mongoose.Types.ObjectId(user.id)
          },
          $inc: {
            favoriteCount: -1
          }
        },
        { new: true }
      );
      pubsub.publish(`note-${note._id}`, {
        noteFavorited: note
      });
      return note;
    } else {
      // user has not previously favorited the post
      const note = await models.Note.findByIdAndUpdate(
        id,
        {
          $push: {
            favoritedBy: mongoose.Types.ObjectId(user.id)
          },
          $inc: {
            favoriteCount: 1
          }
        },
        { new: true }
      );
      console.log(note._id);
      pubsub.publish(`note-${note._id}`, {
        noteFavorited: note
      });
      return note;
    }
  }
};
