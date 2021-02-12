module.exports = {
    async author({ author }, _, { models }) {
        return await models.User.findById(author)
    },

    async favoritedBy({ favoritedBy }, _, { models }) {
        return await models.User.find({ _id: { $in: favoritedBy } })
    }
}
