const { Schema, model } = require('mongoose');

const notesSchema = new Schema(
  {
    content: {
      type: String,
      required: true
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  {
    timestamps: true
  }
);

const Note = new model('Note', notesSchema);

module.exports = Note;
