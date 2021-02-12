const mongoose = require('mongoose')

module.exports = {
    connect: DB_HOST => {
        // use Mongo driver updated url string parser
        mongoose.set('useNewUrlParser', true)
        // use findOneAndUpdate in place of findAndModify
        mongoose.set('useFindAndModify', false)
        // use createIndex instead of ensureIndex
        mongoose.set('setCreateIndex', true)
        // use the new server discovery and monitoring engine
        mongoose.set('useUnifiedTopology', true)
        // connect to the db
        mongoose.connect(DB_HOST)
        // log an error if we fail to connect
        mongoose.connection.on('error', err => {
            console.error(err)
            console.log(
                `MongoDB connection error. Please ensure MongoDB is running`
            )
            process.exit()
        })
    },
    close: () => {
        mongoose.connection.close()
    }
}
