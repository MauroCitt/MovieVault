const { Schema, model } = require('mongoose');

const movieSchema = new Schema
    ({
        id: {type: Number, required: true, unique: true},
        title: {type: String},
        genero: [{type: Number, ref:'genre'}],
        director: {type: String, ref: 'director'},
        crew: [{type: String}],
        providers: [{type: String}],
        popularity: {type: Number},
        vote_count: {type: Number},
        vote_average: {type: Number},
        release_date: {type: String},
        overview: {type: String},
        runtime: {type: Number},
        producers: [{type: String}]
    });

    module.exports = model('movie', movieSchema);