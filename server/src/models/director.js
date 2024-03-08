const {Schema, model} = require('mongoose');

const directorSchema = new Schema
    ({
        id: {type: Number, required: true, unique: true},
        nombre: {type: String, required: true},
        peliculas: [{ type: Number, ref: 'movie', required: true }]
    });

    module.exports = model('director', directorSchema);