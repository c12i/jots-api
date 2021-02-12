module.exports = {
    async notes({ _id }, _, { models }) {
        return await models.Note.find({ author: _id })
            .sort({ _id: -1 })
            .limit(100)
    },

    async favorites({ _id }, _, { models }) {
        return await models.Note.find({ favoritedBy: _id })
            .sort({ _id: -1 })
            .limit(100)
    }
}
