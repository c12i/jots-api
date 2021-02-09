const models = require('../models');

module.exports = {
  async notes() {
    return await models.Note.find();
  },
  async note(_parent, { id }) {
    return await models.Note.findById(id);
  }
};
