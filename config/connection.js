const mongoClient = require('mongodb').MongoClient;

const state = {
    db: null,
}

module.exports.connect = (done) => {
    const url = 'mongodb://localhost:27017';
    // const url = 'mongodb+srv://Anandhu:2FUNEsUNO0KM4nLF@cluster0.31tlqs5.mongodb.net/?retryWrites=true&w=majority';
    const dbname = 'elecxo';

    mongoClient.connect(url, (err, data) => {
        if (err) {
            return done(err);
        }

        state.db = data.db(dbname);
        done();
    })
}

module.exports.get = () => {
    return state.db;
}

