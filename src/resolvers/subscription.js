const { UserInputError } = require('apollo-server-express')

module.exports = {
    noteFavorited: {
        async subscribe(_, { id }, { models, pubsub }) {
            const note = await models.Note.findById(id)
            if (!note) {
                new UserInputError(`Note "${id}" does not exist`)
            }
            return pubsub.asyncIterator([`note-${id}`])
        }
    }
}
