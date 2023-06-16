const { MongoClient } = require('mongodb');
const url = "mongodb://127.0.0.1:27017/words_alpha";

let dbConnection;
module.exports = {
    connectToDb: (cb) => {
        MongoClient.connect(url)
            .then((client) => {
                console.log(`connected to database`);
                dbConnection = client.db();
                return cb();
            })
            .catch((err) => {
                console.log(err);
                return cb(err);
            })

    },

    getDb: () =>  dbConnection
}
